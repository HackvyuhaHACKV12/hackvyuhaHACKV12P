import poses from "../../data/yoga_poses.json";
import PoseDetails from "../../components/PoseDetails/PoseDetails";
import { useParams } from "react-router-dom";

const PoseDetailsPage = () => {
  const { poseId } = useParams();
  const pose = poses[poseId];
  return (
    <main className="mx-6 mb-12 mt-6 md:mx-12 lg:max-w-[80rem] lg:px-32 lg:mx-auto lg:my-12">
      <PoseDetails pose={pose} />
    </main>
  );
};

export default PoseDetailsPage;
