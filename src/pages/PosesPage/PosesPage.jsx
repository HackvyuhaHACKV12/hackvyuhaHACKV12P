import poses from "../../data/yoga_poses.json";
import PoseCard from "../../components/PoseCard/PoseCard";

export const PosesPage = () => {
  return (
    <main className="mx-6 mb-12 md:mx-12 lg:max-w-screen-xl lg:px-32 lg:mx-auto lg:mb-32">
      <h1 className="text-3xl font-semibold mb-6">Learn Yoga Poses</h1>
      <div className="md:grid md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-8 lg:my-12">
        {poses.map((pose) => (
          <PoseCard key={pose.id} id={pose.id} pose={pose} />
        ))}
      </div>
    </main>
  );
};

export default PosesPage;
