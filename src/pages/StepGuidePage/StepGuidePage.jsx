import StepGuide from "../../components/StepWiseGuide/StepGuide";

const StepGuidePage = () => {
  return (
    <div className=" bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">🧘 Tree Pose Step-by-Step Guide</h1>
      <div className="">
        <StepGuide />
      </div>
    </div>
  );
};

export default StepGuidePage;
