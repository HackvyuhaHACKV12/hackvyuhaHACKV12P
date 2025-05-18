import PoseCam from "../../components/PoseCam/PoseCam";
import poses from "../../data/yoga_poses.json";
import { useParams, NavLink } from "react-router-dom";
import { useState } from "react";
import CompletionModal from "../../components/CompletionModal/CompletionModal";
import { refreshPage } from "./../../utils/helper.js";

const SessionCamPage = () => {
  const { poseId } = useParams();
  const pose = poses[poseId];
  const [showModal, setShowModal] = useState(false);

  const isLastPose = Number(poseId) === poses.length - 1;

  const handleNextClick = () => {
    if (isLastPose) {
      setShowModal(true);
    } else {
      refreshPage();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <main className="mx-6 md:mx-12   lg:max-w-screen-xl lg:px-32 lg:mx-auto">
      <PoseCam pose={pose} />
      <div
        className="flex justify-center py-10 gap-4 md:flex-row md:pt-12 md:pb-5 h-50 lg:py-9"
        onClick={handleNextClick}
      >
        {isLastPose ? (
          <button className="btn">All Done</button>
        ) : (
          <NavLink to={`/session/${Number(poseId) + 1}`}>
            <button className="btn h-10 w-30 bg-indigo-400 text-xl rounded-md">Next Pose</button>
          </NavLink>
        )}
      </div>
      <CompletionModal show={showModal} onClose={handleCloseModal} />
    </main>
  );
};

export default SessionCamPage;
