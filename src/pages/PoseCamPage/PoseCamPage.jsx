import PoseCam from "../../components/PoseCam/PoseCam";
import poses from "../../data/yoga_poses.json";
import { useParams } from "react-router-dom";

const PoseCamPage = () => {
  const { poseId } = useParams();
  const pose = poses[poseId];
  return (
    <main className="mx-6 my-6 md:mx-12 md:my-12 lg:max-w-[80rem] lg:px-32 lg:mx-auto lg:my-12">
      <PoseCam pose={pose} />
    </main>
  );
};

export default PoseCamPage;
