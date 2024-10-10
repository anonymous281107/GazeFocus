// import { LoginSchema } from "schema";
// import { Form, Input } from "components/Form";
// import { useGlobalContext } from "hooks";
// import { useState } from "react";
// import { getErrorMessage } from "utils";
// import { useAuthControls } from "hooks/useAuthControls";
// import { Box, Button, Card, Typography, useTheme } from "@mui/material";
// import { useNavigate } from "react-router-dom";



// export default function Login() {
//   const [error, setError] = useState(null);
//   const { setPageLoading } = useGlobalContext();
//   const { login } = useAuthControls();
//   const navigate = useNavigate();
//   const handleClick = async (data) => {
//     console.log('Udupi Clicked');
//     navigate('/degg')
//   };
//   const theme = useTheme()
//   // console.log("theme is", theme)
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "80vh",
//         borderRadius: "10px",
//         padding: "25px",
//       }}
//     >
//       <Card
//         sx={{
//           padding: "15px",
//         }}
//       >
//         <Typography
//           style={{ marginBottom: "20px" }}
//           fontWeight={600}
//           variant="h6"
//           textAlign="center"
//         >
//           Video Dashboard
//         </Typography>
//         {/* <Button onClick={handleClick}>Udupi Upahaar</Button> */}

//         <Button onClick={async () => {
//           navigate('/videoProcess')
//         }}>Video</Button>

//       </Card>
//     </Box >
//   );
// }

import { useState } from "react";
import { Box, Button, Card, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Login Clicked');
    // navigate('/videoDashboard');
    navigate('/Dashboard');
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        // width : "100vw",
        width : "100%",
        // background: "linear-gradient(to right, #43e97b, #38f9d7)",
        background: "radial-gradient(circle, #f0f2f5 0%, #ffffff 70%)"

        // backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        sx={{
          width: "400px",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          // backgroundColor: "#f0f2f5",
        }}
      >
        <Typography fontWeight={600} variant="h5" textAlign="center" mb={2}>
          Welcome
        </Typography>
        <Box display="flex" justifyContent="center" mb={3}>
          <Box sx={{
            width: "50px", height: "50px", backgroundColor: "#000",
            borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center"
          }}>
            <Typography color="white" fontWeight={600} fontSize="24px">GM</Typography>
          </Box>
        </Box>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          
        />
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            background: "linear-gradient(to right, #43e97b, #38f9d7)",
            padding: "10px",
            borderRadius: "25px"
          }}
          onClick={handleClick}
        >
          Login
        </Button>
        <Typography variant="body2" textAlign="center" mt={2}>
          Don't have an account? <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Card>
    </Box>
  );
}

