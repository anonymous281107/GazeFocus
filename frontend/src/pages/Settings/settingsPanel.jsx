// import { useState, useEffect } from "react";
// import { Box, Typography, Slider, Card, CardContent, CardActions, Checkbox, FormControlLabel, Button } from "@mui/material";

// const cardStyle = {
//   width: 300,
//   borderRadius: '10px',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//   backgroundColor: '#f0f2f5',
//   right: '20px',
//   top: '20px',
//   height: '100%', // Use full height
//   display: 'flex', // Enable flexbox for the card
//   flexDirection: 'column', // Make everything align vertically
// };

// export default function SettingsPanel() {
//   const [zoom, setZoom] = useState(100);
//   const [contrast, setContrast] = useState(100);
//   const [brightness, setBrightness] = useState(100);
//   const [sharpening, setSharpening] = useState(false);
//   const [inversion, setInversion] = useState(false);

//   // Load settings from localStorage on component mount
//   useEffect(() => {
//     const savedZoom = localStorage.getItem("zoom") || 100;
//     const savedContrast = localStorage.getItem("contrast") || 100;
//     const savedBrightness = localStorage.getItem("brightness") || 100;
//     const savedSharpening = localStorage.getItem("sharpening") === "true";
//     const savedInversion = localStorage.getItem("inversion") === "true";

//     setZoom(savedZoom);
//     setContrast(savedContrast);
//     setBrightness(savedBrightness);
//     setSharpening(savedSharpening);
//     setInversion(savedInversion);
//     applySettings(savedZoom, savedContrast, savedBrightness, savedSharpening, savedInversion);
//   }, []);

//   // Function to apply settings globally
//   const applySettings = (zoomValue, contrastValue, brightnessValue, sharpenValue, invertValue) => {
//     document.body.style.zoom = `${zoomValue}%`;
//     document.body.style.filter = `
//       contrast(${contrastValue}%)
//       brightness(${brightnessValue}%)
//       ${sharpenValue ? "saturate(120%)" : ""}
//       ${invertValue ? "invert(1)" : ""}
//     `;
//   };

//   const handleZoomChange = (event, newValue) => {
//     setZoom(newValue);
//     localStorage.setItem("zoom", newValue);
//     applySettings(newValue, contrast, brightness, sharpening, inversion);
//   };

//   const handleContrastChange = (event, newValue) => {
//     setContrast(newValue);
//     localStorage.setItem("contrast", newValue);
//     applySettings(zoom, newValue, brightness, sharpening, inversion);
//   };

//   const handleBrightnessChange = (event, newValue) => {
//     setBrightness(newValue);
//     localStorage.setItem("brightness", newValue);
//     applySettings(zoom, contrast, newValue, sharpening, inversion);
//   };

//   const handleSharpeningChange = (event) => {
//     const newSharpening = event.target.checked;
//     setSharpening(newSharpening);
//     localStorage.setItem("sharpening", newSharpening);
//     applySettings(zoom, contrast, brightness, newSharpening, inversion);
//   };

//   const handleInversionChange = (event) => {
//     const newInversion = event.target.checked;
//     setInversion(newInversion);
//     localStorage.setItem("inversion", newInversion);
//     applySettings(zoom, contrast, brightness, sharpening, newInversion);
//   };

//   return (
//     <Card sx={cardStyle}>
//       <CardContent
//         sx={{ 
//           display: 'flex', 
//           flexDirection: 'column', 
//           flexGrow: 1 
//         }}
//       >
//         <Typography variant="h6" component="div" gutterBottom sx={{ flexGrow: 0 }}>
//           Settings
//         </Typography>

//         {/* Zoom */}
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="body2">Zoom: {zoom}%</Typography>
//           <Slider
//             value={zoom}
//             onChange={handleZoomChange}
//             min={50}
//             max={150}
//             step={10}
//             aria-labelledby="zoom-slider"
//           />
//         </Box>

//         {/* Contrast */}
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="body2">Contrast: {contrast}%</Typography>
//           <Slider
//             value={contrast}
//             onChange={handleContrastChange}
//             min={50}
//             max={150}
//             step={10}
//             aria-labelledby="contrast-slider"
//           />
//         </Box>

//         {/* Brightness */}
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="body2">Brightness: {brightness}%</Typography>
//           <Slider
//             value={brightness}
//             onChange={handleBrightnessChange}
//             min={50}
//             max={150}
//             step={10}
//             aria-labelledby="brightness-slider"
//           />
//         </Box>

//         <Box sx={{ flexGrow: 1 }}>
//         {/* Sharpening Checkbox */}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={sharpening}
//               onChange={handleSharpeningChange}
//             />
//           }
//           label="Sharpening"
//           sx={{ flexGrow: 1 }}
//         />

//         {/* Inversion Checkbox */}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={inversion}
//               onChange={handleInversionChange}
//             />
//           }
//           label="Inversion"
//           sx={{ flexGrow: 1 }}
//         />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }


import { useState, useEffect } from "react";
import { Box, Typography, Slider, Checkbox, FormControlLabel } from "@mui/material";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ContrastIcon from '@mui/icons-material/Contrast';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import TuneIcon from '@mui/icons-material/Tune';  // For sharpening
import InvertColorsIcon from '@mui/icons-material/InvertColors';


const settingsBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
//   backgroundColor: '#f0f2f5',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px', // Creates space between settings bar and video player
};

const sliderStyle = {
  width: '120px',
  marginLeft: '10px',
};

export default function SettingsBar() {
  const [zoom, setZoom] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [sharpening, setSharpening] = useState(false);
  const [inversion, setInversion] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedZoom = localStorage.getItem("zoom") || 100;
    const savedContrast = localStorage.getItem("contrast") || 100;
    const savedBrightness = localStorage.getItem("brightness") || 100;
    const savedSharpening = localStorage.getItem("sharpening") === "true";
    const savedInversion = localStorage.getItem("inversion") === "true";

    setZoom(savedZoom);
    setContrast(savedContrast);
    setBrightness(savedBrightness);
    setSharpening(savedSharpening);
    setInversion(savedInversion);
    applySettings(savedZoom, savedContrast, savedBrightness, savedSharpening, savedInversion);
  }, []);

  // Function to apply settings globally
  const applySettings = (zoomValue, contrastValue, brightnessValue, sharpenValue, invertValue) => {
    document.body.style.zoom = `${zoomValue}%`;
    document.body.style.filter = `
      contrast(${contrastValue}%)
      brightness(${brightnessValue}%)
      ${sharpenValue ? "saturate(120%)" : ""}
      ${invertValue ? "invert(1)" : ""}
    `;
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
    localStorage.setItem("zoom", newValue);
    applySettings(newValue, contrast, brightness, sharpening, inversion);
  };

  const handleContrastChange = (event, newValue) => {
    setContrast(newValue);
    localStorage.setItem("contrast", newValue);
    applySettings(zoom, newValue, brightness, sharpening, inversion);
  };

  const handleBrightnessChange = (event, newValue) => {
    setBrightness(newValue);
    localStorage.setItem("brightness", newValue);
    applySettings(zoom, contrast, newValue, sharpening, inversion);
  };

  const handleSharpeningChange = (event) => {
    const newSharpening = event.target.checked;
    setSharpening(newSharpening);
    localStorage.setItem("sharpening", newSharpening);
    applySettings(zoom, contrast, brightness, newSharpening, inversion);
  };

  const handleInversionChange = (event) => {
    const newInversion = event.target.checked;
    setInversion(newInversion);
    localStorage.setItem("inversion", newInversion);
    applySettings(zoom, contrast, brightness, sharpening, newInversion);
  };

  // return (
  //   <Box sx={settingsBarStyle}>
  //     {/* Zoom */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Typography variant="body2">Zoom:</Typography>
  //       <Slider
  //         value={zoom}
  //         onChange={handleZoomChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="zoom-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>

  //     {/* Contrast */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Typography variant="body2">Contrast:</Typography>
  //       <Slider
  //         value={contrast}
  //         onChange={handleContrastChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="contrast-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>

  //     {/* Brightness */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Typography variant="body2">Brightness:</Typography>
  //       <Slider
  //         value={brightness}
  //         onChange={handleBrightnessChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="brightness-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>

  //     {/* Sharpening Checkbox */}
  //     <FormControlLabel
  //       control={
  //         <Checkbox
  //           checked={sharpening}
  //           onChange={handleSharpeningChange}
  //         />
  //       }
  //       label="Sharpening"
  //     />

  //     {/* Inversion Checkbox */}
  //     <FormControlLabel
  //       control={
  //         <Checkbox
  //           checked={inversion}
  //           onChange={handleInversionChange}
  //         />
  //       }
  //       label="Inversion"
  //     />
  //   </Box>
  // );

  // return (
  //   <Box sx={settingsBarStyle}>
  //     {/* Zoom */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <ZoomInIcon sx={{ marginRight: 1 }} />
  //       <Typography variant="body2">Zoom:</Typography>
  //       <Slider
  //         value={zoom}
  //         onChange={handleZoomChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="zoom-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>
  
  //     {/* Contrast */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <ContrastIcon sx={{ marginRight: 1 }} />
  //       <Typography variant="body2">Contrast:</Typography>
  //       <Slider
  //         value={contrast}
  //         onChange={handleContrastChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="contrast-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>
  
  //     {/* Brightness */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Brightness4Icon sx={{ marginRight: 1 }} />
  //       <Typography variant="body2">Brightness:</Typography>
  //       <Slider
  //         value={brightness}
  //         onChange={handleBrightnessChange}
  //         min={50}
  //         max={150}
  //         step={10}
  //         aria-labelledby="brightness-slider"
  //         sx={sliderStyle}
  //       />
  //     </Box>
  
  //     {/* Sharpening Checkbox */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <TuneIcon sx={{ marginRight: 1 }} />
  //       <FormControlLabel
  //         control={
  //           <Checkbox
  //             checked={sharpening}
  //             onChange={handleSharpeningChange}
  //           />
  //         }
  //         label="Sharpening"
  //       />
  //     </Box>
  
  //     {/* Inversion Checkbox */}
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <InvertColorsIcon sx={{ marginRight: 1 }} />
  //       <FormControlLabel
  //         control={
  //           <Checkbox
  //             checked={inversion}
  //             onChange={handleInversionChange}
  //           />
  //         }
  //         label="Inversion"
  //       />
  //     </Box>
  //   </Box>
  // );
  

  const settingsColor = '#2779a7';  // Your desired color theme

  return (
    <Box sx={settingsBarStyle}>
      {/* Zoom */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: settingsColor, marginRight: 1 }}>Zoom:</Typography>
        <ZoomInIcon sx={{ color: settingsColor }} />
        <Slider
          value={zoom}
          onChange={handleZoomChange}
          min={50}
          max={150}
          step={10}
          aria-labelledby="zoom-slider"
          sx={{
            ...sliderStyle,
            color: settingsColor,  // Applies the color to slider
          }}
        />
      </Box>
  
      {/* Contrast */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: settingsColor, marginRight: 1 }}>Contrast:</Typography>
        <ContrastIcon sx={{ color: settingsColor }} />
        <Slider
          value={contrast}
          onChange={handleContrastChange}
          min={50}
          max={150}
          step={10}
          aria-labelledby="contrast-slider"
          sx={{
            ...sliderStyle,
            color: settingsColor,
          }}
        />
      </Box>
  
      {/* Brightness */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: settingsColor, marginRight: 1 }}>Brightness:</Typography>
        <Brightness4Icon sx={{ color: settingsColor }} />
        <Slider
          value={brightness}
          onChange={handleBrightnessChange}
          min={50}
          max={150}
          step={10}
          aria-labelledby="brightness-slider"
          sx={{
            ...sliderStyle,
            color: settingsColor,
          }}
        />
      </Box>
  
      {/* Sharpening Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: settingsColor, marginRight: 1 }}>Sharpening:</Typography>
        <TuneIcon sx={{ color: settingsColor, marginRight: 1 }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={sharpening}
              onChange={handleSharpeningChange}
              sx={{
                color: settingsColor,
                '&.Mui-checked': { color: settingsColor },  // Color when checked
              }}
            />
          }
          label=""
        />
      </Box>
  
      {/* Inversion Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: settingsColor, marginRight: 1 }}>Inversion:</Typography>
        <InvertColorsIcon sx={{ color: settingsColor, marginRight: 1 }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={inversion}
              onChange={handleInversionChange}
              sx={{
                color: settingsColor,
                '&.Mui-checked': { color: settingsColor },
              }}
            />
          }
          label=""
        />
      </Box>
    </Box>
  );
  

}

