import StepCard from "./StepCard";

const StepList = ({ steps, currentStep, doneSteps }) => {
  return (
    <div className="flex flex-wrap gap-4 py-4 px-2">
      {steps.map((step, index) => (
        <StepCard
          key={index}
          step={step}
          isCurrent={currentStep === index}
          isDone={doneSteps.includes(index)}
        />
      ))}
    </div>
  );
};

export default StepList;
