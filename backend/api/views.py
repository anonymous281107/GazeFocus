from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from django.conf import settings
import numpy as np
import torch
import matplotlib.pyplot as plt
from PIL import Image
import cv2
import os
from django.http import FileResponse
import io
import imageio
import tempfile
import socketio
from django_socketio import SocketIO

os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")
print(f"using device: {device}")

if device.type == "cuda":
    torch.autocast("cuda", dtype=torch.bfloat16).__enter__()
    if torch.cuda.get_device_properties(0).major >= 8:
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.backends.cudnn.allow_tf32 = True
elif device.type == "mps":
    print(
        "\nSupport for MPS devices is preliminary. SAM 2 is trained with CUDA and might "
        "give numerically different outputs and sometimes degraded performance on MPS. "
        "See e.g. https://github.com/pytorch/pytorch/issues/84936 for a discussion."
    )

np.random.seed(3)

def show_mask(mask, ax, random_color=False, borders = True):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30/255, 144/255, 255/255, 0.6])
    h, w = mask.shape[-2:]
    mask = mask.astype(np.uint8)
    mask_image =  mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    if borders:
        import cv2
        contours, _ = cv2.findContours(mask,cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        contours = [cv2.approxPolyDP(contour, epsilon=0.01, closed=True) for contour in contours]
        mask_image = cv2.drawContours(mask_image, contours, -1, (1, 1, 1, 0.5), thickness=2)
    ax.imshow(mask_image)

def show_points(coords, labels, ax, marker_size=375):
    pos_points = coords[labels==1]
    neg_points = coords[labels==0]
    ax.scatter(pos_points[:, 0], pos_points[:, 1], color='green', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)
    ax.scatter(neg_points[:, 0], neg_points[:, 1], color='red', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)

def show_box(box, ax):
    x0, y0 = box[0], box[1]
    w, h = box[2] - box[0], box[3] - box[1]
    ax.add_patch(plt.Rectangle((x0, y0), w, h, edgecolor='green', facecolor=(0, 0, 0, 0), lw=2))

def show_masks(image, masks, scores, point_coords=None, box_coords=None, input_labels=None, borders=True):
    for i, (mask, score) in enumerate(zip(masks, scores)):
        plt.figure(figsize=(10, 10))
        plt.imshow(image)
        show_mask(mask, plt.gca(), borders=borders)
        if point_coords is not None:
            assert input_labels is not None
            show_points(point_coords, input_labels, plt.gca())
        if box_coords is not None:
            show_box(box_coords, plt.gca())
        if len(scores) > 1:
            plt.title(f"Mask {i+1}, Score: {score:.3f}", fontsize=18)
        plt.axis('off')
        plt.show()

from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

sam2_checkpoint = "./segment-anything-2/checkpoints/sam2_hiera_large.pt"
model_cfg = "sam2_hiera_l.yaml"

sam2_model = build_sam2(model_cfg, sam2_checkpoint, device=device)

predictor = SAM2ImagePredictor(sam2_model)

def createVideo(video, framenumber, gazeData):
    video_path = video
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    ret, first_frame = cap.read()
    height, width, _ = first_frame.shape
    frame_count = 0
    predictor.set_image(first_frame)
    input_box = np.array([1071, 256, 1748, 682])
    masks, scores, ex_logits = predictor.predict(
        point_coords=None,
        point_labels=None,
        box=input_box[None, :],
        multimask_output=False,
    )
    mask_input = ex_logits[0, :, :]
    mask_input = np.expand_dims(mask_input, 0)
    temp_video = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
    temp_video_name = temp_video.name
    temp_video.close()
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(temp_video_name, fourcc, fps, (width, height))
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        predictor.set_image(frame)
        masks, scores, ex_logits = predictor.predict(
            point_coords=None,
            point_labels=None,
            mask_input=mask_input,
            multimask_output=False
        )

        mask_input = ex_logits[0, :, :]
        mask_input = np.expand_dims(mask_input, 0)
        frame_count += 1
        non_zero_coords = np.nonzero(masks[0])
        x_min, x_max = np.min(non_zero_coords[1]), np.max(non_zero_coords[1])
        y_min, y_max = np.min(non_zero_coords[0]), np.max(non_zero_coords[0])
        cropped_image = frame[y_min:y_max, x_min:x_max]
        height, width = cropped_image.shape[:2]
        new_width = width * 2
        new_height = height * 2
        zoomed_image = cv2.resize(cropped_image, (new_width, new_height), interpolation=cv2.INTER_LINEAR)
        zoomed_mask = cv2.resize(masks[0][y_min:y_max, x_min:x_max].astype(np.uint8), (new_width, new_height), interpolation=cv2.INTER_NEAREST)
        overlay_x_min = x_min - (new_width - width) // 2
        overlay_y_min = y_min - (new_height - height) // 2
        overlay_x_max = overlay_x_min + new_width
        overlay_y_max = overlay_y_min + new_height
        overlay_x_min = max(0, overlay_x_min)
        overlay_y_min = max(0, overlay_y_min)
        overlay_x_max = min(frame.shape[1], overlay_x_max)
        overlay_y_max = min(frame.shape[0], overlay_y_max)
        zoomed_mask_resized = zoomed_mask.astype(bool)
        output_image = frame.copy()
        zoomed_area = output_image[overlay_y_min:overlay_y_max, overlay_x_min:overlay_x_max]
        zoomed_image_cropped = zoomed_image[:(overlay_y_max - overlay_y_min), :(overlay_x_max - overlay_x_min)]
        zoomed_mask_resized_cropped = zoomed_mask_resized[:(overlay_y_max - overlay_y_min), :(overlay_x_max - overlay_x_min)]
        output_image[overlay_y_min:overlay_y_max, overlay_x_min:overlay_x_max][zoomed_mask_resized_cropped] = zoomed_image_cropped[zoomed_mask_resized_cropped]
        color = (0, 255, 0)
        thickness = 2
        cv2.rectangle(output_image, (overlay_x_min, overlay_y_min), (overlay_x_max, overlay_y_max), color, thickness)
        output_image = cv2.cvtColor(output_image, cv2.COLOR_RGB2BGR)
        output_image = output_image.astype(np.uint8)
        writer.write(output_image)
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break
    writer.release()
    cap.release()
    cv2.destroyAllWindows()
    with open(temp_video_name, 'rb') as f:
        video_data = f.read()
    buffer = io.BytesIO(video_data)
    os.remove(temp_video_name)
    buffer.seek(0)
    return buffer

sio = socketio.Server()

@sio.on('connect')
def connect(sid, environ):
    print(f"Client {sid} connected.")

@sio.on('sim')
def sim(sid, data):
    video = data['video']
    frame_number = data['frame_num']
    gaze_data = data['gaze_data']
    buffer = createVideo(video, frame_number, gaze_data)
    output_video_path = './tempVid.mp4'
    with open(output_video_path, 'wb') as f:
        f.write(buffer.read())
    with open(output_video_path, 'rb') as f:
        video_data = f.read()
    buffer = io.BytesIO(video_data)
    buffer.seek(0)
    sio.emit('sim_response', {'video': buffer.read()})

@sio.on('disconnect')
def disconnect(sid):
    print(f"Client {sid} disconnected.")


api_view(['POST'])
def videoProcess(request, *args, **kwrgs):
    frame_number = request.data['frame_num']
    buffer = createVideo()
    output_video_path = './tempVid.mp4'
    with open(output_video_path, 'wb') as f:
        f.write(buffer.read())
    response = FileResponse(buffer, content_type='video/mp4')
    response['Content-Disposition'] = 'attachment; filename="processed_video.mp4"'
    return response

@api_view(['POST'])
def getInitialVideo(request, *args, **kwrgs):
    video_name = request.data['video_name']
    video_path = './videoData/' + video_name + '.mp4'
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not os.path.exists(video_path):
        return Response({"error": "Video not found"}, status=404)
    try:
        video_file = open(video_path, 'rb')
    except IOError:
        return Response({"error": "Could not read video file"}, status=500)
    response = FileResponse(video_file, content_type='video/mp4')
    response['Content-Disposition'] = 'inline; filename="test.mp4"'
    response['X-FPS'] = str(fps)
    response['Access-Control-Expose-Headers'] = 'X-FPS'
    return response