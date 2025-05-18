import { NavLink } from "react-router-dom";

const PoseCard = ({ pose }) => {
  const { id, image, english_name, pose_description } = pose;

  return (
    <div className="flex flex-col w-full h-auto py-4 transition-all duration-[900ms] ease-in-out">
      <div className="bg-white p-4 md:p-6 rounded-[50px] border border-gray-600 flex flex-col flex-grow">
        <img
          className="rounded-[25px] w-full h-[15rem] object-contain"
          src={image}
          alt="yoga pose"
        />

        <div className="pt-4 px-2 flex flex-col justify-between flex-grow">
          {/* Tags */}
          <div className="flex gap-1 mb-2 flex-wrap">
            {pose.categories.map((category, index) => (
              <span
                key={index}
                className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-800"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Pose Name & Description */}
          <h4 className="mt-4 text-lg font-semibold">{english_name}</h4>
          <p className="mt-1 text-gray-700">{pose_description}</p>

          {/* Buttons */}
          <div className="mt-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-4">
            <NavLink to={`/practice/${pose.id}`}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition">
                Practice
              </button>
            </NavLink>
            <NavLink
              to={`/poses/${id}`}
              className="text-sm md:text-base px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              Details
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseCard;
