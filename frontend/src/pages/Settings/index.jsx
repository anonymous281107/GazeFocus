import { useState, useEffect } from "react";
import { Modal, Box, Typography, Slider, Button } from "@mui/material";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function SettingsModal({ open, handleClose }) {
  const [zoom, setZoom] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedZoom = localStorage.getItem("zoom") || 100;
    const savedContrast = localStorage.getItem("contrast") || 100;
    setZoom(savedZoom);
    setContrast(savedContrast);
    applySettings(savedZoom, savedContrast);
  }, []);

  // Function to apply zoom and contrast globally
  const applySettings = (zoomValue, contrastValue) => {
    document.body.style.zoom = `${zoomValue}%`;
    document.body.style.filter = `contrast(${contrastValue}%)`;
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
    localStorage.setItem("zoom", newValue);
    applySettings(newValue, contrast);
  };

  const handleContrastChange = (event, newValue) => {
    setContrast(newValue);
    localStorage.setItem("contrast", newValue);
    applySettings(zoom, newValue);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="settings-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography id="settings-modal-title" variant="h6" component="h2" mb={2}>
          Settings
        </Typography>

        <Typography>Zoom: {zoom}%</Typography>
        <Slider
          value={zoom}
          onChange={handleZoomChange}
          min={50}
          max={150}
          step={10}
        />

        <Typography>Contrast: {contrast}%</Typography>
        <Slider
          value={contrast}
          onChange={handleContrastChange}
          min={50}
          max={150}
          step={10}
        />

        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
