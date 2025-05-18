const StepCard = ({ step, isCurrent, isDone }) => {
  return (
   <div className="w-full ">
      <div className={` rounded-xl w-90 border p-4 mb-4 shadow ${isCurrent ? 'bg-yellow-50' : isDone ? 'bg-green-50' : 'bg-white'}`}>
      <img src={step.image} alt="Step" className="rounded max-sm:w-full w-80 h-100 object-contain " />
      <p className="mt-2 text-lg font-medium">{step.instruction}</p>
      {isDone && <p className="text-green-600 mt-2 font-semibold">✅ Done</p>}
      {isCurrent && !isDone && <p className="text-yellow-500 mt-2">⏳ Do this now</p>}
    </div>
   </div>
  );
};

export default StepCard;