import cameraAsk from "../../assets/images/webcam-permission.png";
import webcamRight from "../../assets/images/webcam-right.png";
import chairPose from "../../assets/images/chair.jpeg";
import { NavLink } from "react-router-dom";

const InstructionsPage = () => {
  return (
    <main className="mx-6 md:mx-12 lg:max-w-[80rem] lg:px-32 lg:mx-auto lg:my-12 my-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Instructions</h1>
      <div className="lg:my-16">
        <ul className="flex flex-col md:flex-row flex-col justify-between md:justify-between text-center gap-9">
          <li className="md:w-[30vw] lg:w-[25rem]">
            <div className="text-[3.125rem]">1️⃣</div>
            <p className="md:h-28 lg:h-20">
              Accept camera access and wait for the webcam to load.
            </p>
            <img
              className="rounded-md w-full relative -z-10 mt-2"
              src={cameraAsk}
              alt="google chrome camera permissions"
            />
          </li>
          <li className="md:w-[30vw] lg:w-[25rem]">
            <div className="text-[3.125rem]">2️⃣</div>
            <p className="md:h-28 lg:h-20">
              Make sure that the key points are visible on your body and there
              are no background distractions.
            </p>
            <img
              className="rounded-[1.5625rem] w-full relative -z-10 mt-2"
              src={webcamRight}
              alt="correct webcam alignment"
            />
          </li>
          <li className="md:w-[30vw] lg:w-[25rem]">
            <div className="text-[3.125rem]">3️⃣</div>
            <p className="md:h-28 lg:h-20">
              Follow the pose visual and mimic that on camera. You will get
              feedback on your form.
            </p>
            <img
              className="rounded-[1.5625rem] w-full relative -z-10 mt-2"
              src={chairPose}
              alt="incorrect camera alignment"
            />
          </li>
        </ul>
      </div>
      <div className="flex justify-center py-4 tablet:mt-9">
        <NavLink to="/session/0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            I'm ready!
          </button>
        </NavLink>
      </div>
    </main>
  );
};

export default InstructionsPage;
