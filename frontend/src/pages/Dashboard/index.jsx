import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '../Settings/index';  // Import the new SettingsModal component

const contentData = [
  {
    image: 'https://plus.unsplash.com/premium_photo-1669750817438-3f7f3112de8d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Feel the concert vibe',
    subtitle: 'Clicking the best times',
  },
  {
    image: 'https://images.unsplash.com/photo-1670414701148-16ac8873a150?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Create your zen space at home',
    subtitle: 'Peace out',
  },
  {
    image: 'https://images.unsplash.com/photo-1679420437970-a5163faeb58b?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Explore Art',
    subtitle: 'Artful inspiration',
  },
  {
    image: 'https://images.unsplash.com/photo-1595009900544-9063bf483547?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Fashion Trends',
    subtitle: 'Stay Stylish',
  },
  {
    image: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=1767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Inspiration',
    subtitle: 'Find your muse',
  },
];

export default function Dashboard({ items = contentData }) {

    const navigate = useNavigate();

    // Navigate to /videoProcess when card is clicked
    const handleCardClick = () => {
      navigate('/videoProcess');
    };


    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // const navigate = useNavigate();
    // const [settingsOpen, setSettingsOpen] = useState(false);
    // const [zoom, setZoom] = useState(100);
    // const [contrast, setContrast] = useState(100);
  
    // // Load settings from localStorage when the component mounts
    // useEffect(() => {
    //   const storedZoom = localStorage.getItem('zoom') || 100;
    //   const storedContrast = localStorage.getItem('contrast') || 100;
    //   setZoom(parseInt(storedZoom, 10));
    //   setContrast(parseInt(storedContrast, 10));
    // }, []);
  
    // // Update zoom and contrast in localStorage
    // const saveSettings = () => {
    //   localStorage.setItem('zoom', zoom);
    //   localStorage.setItem('contrast', contrast);
    //   setSettingsOpen(false);
    //   applyGlobalStyles();
    // };
  
    // // Apply zoom and contrast globally
    // const applyGlobalStyles = () => {
    //   document.body.style.zoom = `${zoom}%`;
    //   document.body.style.filter = `contrast(${contrast}%)`;
    // };
  
    // // Apply settings on load
    // useEffect(() => {
    //   applyGlobalStyles();
    // }, [zoom, contrast]);
  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        // backgroundColor: "#f0f2f5",
      }}
    >
 {/* Top Buttons */}
 <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button variant="outlined" sx={{ marginRight: '10px' }} onClick={handleOpenModal}>
          Settings
        </Button>
        <Button variant="contained" color="error" onClick={() => navigate('/login')}>
          Log out
        </Button>
      </Box>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="600" gutterBottom>
        October 4, 2024
      </Typography>
      <Typography variant="h3" fontWeight="600" mb={4}>
        Stay Inspired
      </Typography>

      {/* Content Rows */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {items.map((item, index) => (
            <Card
            key={index}
            onClick={handleCardClick} // Navigate to videoProcess on click
            sx={{
              width: '300px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.10)', // Enlarge on hover
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', // Elevate on hover
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {item.subtitle}
              <Typography variant="h6">{item.title}</Typography>
            </Box>
          </Card>
        ))}
      </Box>

       {/* Use the SettingsModal here */}
       {/* <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        zoom={zoom}
        setZoom={setZoom}
        contrast={contrast}
        setContrast={setContrast}
        saveSettings={saveSettings}
      /> */}

<SettingsModal open={openModal} handleClose={handleCloseModal} />
    </Box>
  );
}

