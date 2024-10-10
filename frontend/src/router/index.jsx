import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicElement, ProtectedElement } from "components/Element";

const HomePage = lazy(() => import("pages/Login"));
const Login = lazy(() => import("pages/Login"));
const VideoProcess = lazy(() => import("pages/VideoProcess"));
const Dashboard = lazy(() => import("pages/Dashboard"));
const FourOhFour = lazy(() => import("pages/Error/FourOhFour"));

const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicElement component={Login} />} />
      <Route path="/videoProcess" element={<PublicElement component={VideoProcess} />} />
      <Route path="/dashboard" element={<PublicElement component={Dashboard} />} />
      <Route path="/" element={<ProtectedElement component={HomePage} />} />
      <Route path="*" element={<FourOhFour />} />
    </Routes>
  );
};

export default Router;
