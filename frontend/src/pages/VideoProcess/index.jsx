// import VideoPlayer from "components/VideoPlayer";
// import React, { useState, useEffect } from 'react';
// import { Box, Card, Typography, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import SettingsModal from '../Settings/index';  // Import the new SettingsModal component
// import SettingsPanel from "pages/Settings/settingsPanel";

// export default function VideoProcess() {
//     const navigate = useNavigate();

//     const [openModal, setOpenModal] = useState(false);

//     const handleOpenModal = () => setOpenModal(true);
//     const handleCloseModal = () => setOpenModal(false);
//     return <>
//     <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' , padding: '20px',}}>
//     <Button variant="outlined" sx={{ marginRight: '10px' }} onClick={handleOpenModal}>
//           Settings
//         </Button>
//         <Button variant="contained" color="error" onClick={() => navigate('/Dashboard')}>
//           Dashboard
//         </Button>
//       </Box>

//         <SettingsPanel />
//         <VideoPlayer />
//     </>
// }

import VideoPlayer from "components/VideoPlayer";
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from "pages/Settings/settingsPanel"; // Import the SettingsPanel component

export default function VideoProcess() {
    const navigate = useNavigate();

    // State to manage the visibility of the settings panel
    const [showSettings, setShowSettings] = useState(false);

    // Function to toggle the settings panel
    const toggleSettingsPanel = () => {
        setShowSettings(prev => !prev);
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '20px' }}>
                <Button variant="outlined" sx={{ color: "#2779a7", marginRight: '10px' }} onClick={toggleSettingsPanel}>
                    {showSettings ? "Hide Settings" : "Show Settings"}
                </Button>
                <Button variant="contained" sx={{ color: "#ffffff", background: "#DF6C4F" }} onClick={() => navigate('/Dashboard')}>
                    DASHBOARD
                </Button>
            </Box>

            {/* Conditionally render the SettingsPanel */}
            {showSettings && <SettingsPanel />}
            <VideoPlayer />
        </>
    );
}
