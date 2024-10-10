import { QuerySchema } from "schema";
import { Form, Input } from "components/Form";
import { useGlobalContext } from "hooks";
import { useState, useRef, useEffect } from "react";
import { getErrorMessage } from "utils";
import { useAuthControls } from "hooks/useAuthControls";
import { Box, Button, Card, Typography, useTheme, Grid, Fab, TextField } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import LinearProgress from '@mui/material/LinearProgress';
import { request } from "api";
import { DataGrid } from '@mui/x-data-grid';
import SendIcon from '@mui/icons-material/Send';
import ReactPlayer from 'react-player';

const getVideo = async () => {
    console.log('"Making Initial request');
    const response = await request({ method: "POST", url: '/getInitialVideo', responseType: 'blob' })
    const fpsHeader = response.headers['x-fps'];
    const fps = parseFloat(fpsHeader);
    console.log('Is fps there,', fps);
    return { videoBlob: response.data, fps };
}

export default function VideoPlayer(props) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [fps, setFps] = useState(30);  // Default fps
    const [currentDuration, setCurrentDuration] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [totalFrames, setTotalFrames] = useState(0);
    const playerRef = useRef(null);
    const video = useQuery({ queryKey: ["video"], queryFn: () => getVideo() }, { staleTime: Infinity });

    const handlePause = () => {
        if (playerRef.current) {
            const playedSeconds = playerRef.current.getCurrentTime();
            setCurrentDuration(playedSeconds);

            // Calculate current frame number
            const frame = Math.round(playedSeconds * fps);
            setCurrentFrame(frame);
        }
    };

    const handleDuration = (duration) => {
        setTotalDuration(duration);

        // Calculate total number of frames
        const frames = Math.round(duration * fps);
        setTotalFrames(frames);
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const settingsBarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#ffffff', // High contrast, accessible background
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        marginBottom: '25px', // Creates space between settings bar and video player
    };

    const videoContainerStyle = {
        padding: '20px',
        backgroundColor: '#f7f9fc', // Accessible color for background
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const loadingStyle = {
        textAlign: 'center',
        color: '#333', // High contrast for readability
        padding: '20px',
    };

    useEffect(() => {
        if (video.data && video.data?.videoBlob && video.data.fps) {
            const { videoBlob, fps } = video.data;
            setFps(fps);

            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);

            // Clean up the URL when the component unmounts
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            console.warn('Data is missing videoBlob or fps:', video.fps);
        }
    }, [video.data]);

    if (video.isLoading) {
        return <h1 style={loadingStyle}>Loading ...</h1>;
    }
    if (video.isError) {
        return <h1 style={loadingStyle}>Error loading video...</h1>;
    }

    return (
        <Box sx={videoContainerStyle}>
            {videoUrl ? (
                <Box sx={settingsBarStyle}>
                    <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        controls={true}
                        width="100%"
                        height="auto"
                        onPause={handlePause}
                        onDuration={handleDuration}
                    />
                </Box>
            ) : (
                <h1 style={loadingStyle}>Loading ...</h1>
            )}

            {/* <Typography variant="h6" gutterBottom sx={{ color: '#555', marginTop: '15px' }}>
                {`Current Duration: ${formatDuration(currentDuration)} (Frame ${currentFrame} of ${totalFrames})`}
            </Typography> */}
        </Box>
    );
}