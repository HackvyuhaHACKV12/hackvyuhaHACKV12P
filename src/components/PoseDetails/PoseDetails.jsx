import backIcon from "./../../assets/icons/back.png";
import { NavLink } from "react-router-dom";

const PoseDetails = ({ pose }) => {
  const {
    id,
    english_name,
    sanskrit_name,
    sanskrit_name_adapted,
    image,
    pose_description,
    pose_benefits,
    instructions,
    common_mistakes,
    tips,
  } = pose;

  return (
    <>
      <div className="flex items-baseline gap-6">
        <NavLink to="/poses" className="hover:translate-x-2 transition-transform duration-300">
          <img
            className="w-5 pb-1"
            src={backIcon}
            alt="back icon"
          />
        </NavLink>
        <h1>{english_name}</h1>
      </div>

      <div className="flex flex-col tablet:flex-row tablet:gap-9 tablet:items-start">
        <div className="flex flex-col tablet:w-1/2">
          <img
            className="w-full border border-gray-600 rounded-[1.5625rem]"
            src={image}
            alt="yoga pose"
          />
          <h4 className="text-center font-normal text-[0.9375rem] pt-4 tablet:text-base tablet:pt-2">
            {sanskrit_name_adapted} | {sanskrit_name}
          </h4>
        </div>

        <div className="flex flex-col items-center tablet:w-1/2 tablet:items-start">
          <div className="flex gap-1 justify-center tablet:justify-start flex-wrap mb-2">
            {pose.categories.map((category, index) => (
              <span key={index} className="bg-white text-gray-600 px-2 py-1 rounded-full border text-sm">
                {category}
              </span>
            ))}
          </div>
          <p className="text-center tablet:text-left text-xl tablet:text-xl desktop:text-[1.75rem]">
            {pose_description}
          </p>
          <NavLink to={`/practice/${id}`} className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Practice
            </button>
          </NavLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 py-10 tablet:grid-cols-2 tablet:gap-12 tablet:py-6">
        <div className="bg-white p-9 border border-gray-600 rounded-[1.5625rem]">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc ml-6 space-y-2">
            {pose_benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-9 border border-gray-600 rounded-[1.5625rem]">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal ml-6 space-y-2">
            {instructions.map((step, index) => (
              <li key={index} className="font-normal">{step}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white p-9 border border-gray-600 rounded-[1.5625rem]">
          <h2 className="text-2xl font-semibold mb-4">Common Mistakes</h2>
          <ul className="list-disc ml-6 space-y-2">
            {common_mistakes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-9 border border-gray-600 rounded-[1.5625rem]">
          <h2 className="text-2xl font-semibold mb-4">Tips</h2>
          <ul className="list-disc ml-6 space-y-2">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PoseDetails;