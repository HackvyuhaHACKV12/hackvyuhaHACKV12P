import { NavLink } from "react-router-dom";
import closeIcon from "./../../assets/icons/exit.svg";

const CompletionModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000]">
      <div
        className={`
          bg-white text-center relative
          px-6 py-6 sm:px-10 sm:pt-20 sm:pb-12
          sm:rounded-[25px] sm:w-[70vw] sm:mx-10
          w-full h-full sm:h-auto
        `}
      >
        <button
          className="absolute top-2.5 right-2.5 bg-transparent border-none"
          onClick={onClose}
        >
          <img src={closeIcon} alt="Close" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold mb-2">🎉 Great Job!</h1>
        <p className="mb-4">You have completed all the poses.</p>
        <NavLink to="/poses">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Back to Poses
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default CompletionModal;
