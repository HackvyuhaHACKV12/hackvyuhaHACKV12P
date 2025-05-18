import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import PosesPage from "./pages/PosesPage/PosesPage";
import PoseDetailsPage from "./pages/PoseDetailsPage/PoseDetailsPage";
import PoseCamPage from "./pages/PoseCamPage/PoseCamPage";
import InstructionsPage from "./pages/InstructionsPage/InstructionsPage";
import SessionCamPage from "./pages/SessionCamPage/SessionCamPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Dashboard from "./pages/Dashboard";
import StepGuidePage from "./pages/StepGuidePage/StepGuidePage";
const App = () => {``
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poses" element={<PosesPage />} />
          <Route path="/poses/:poseId" element={<PoseDetailsPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/practice/:poseId" element={<PoseCamPage />} />
          <Route path="/session/:poseId" element={<SessionCamPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guide" element={<StepGuidePage/>} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
