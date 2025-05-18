import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  const yogaIcons = [
    "🧘‍♀️",
    "🧘🏿‍♂️",
    "🧘🏼‍♀️",
    "🧘🏽‍♂️",
    "🧘🏿‍♀️",
    "🧘🏼‍♂️",
    "🧘🏽‍♀️",
    "🧘🏾‍♂️",
    "🧘🏻‍♀️",
    "🧘🏾‍♂️",
    "🧘‍♀️",
    "🧘🏿‍♂️",
    "🧘🏼‍♀️",
    "🧘🏽‍♂️",
    "🧘🏿‍♀️",
    "🧘🏼‍♂️",
    "🧘🏽‍♀️",
    "🧘🏾‍♂️",
  ];

  useEffect(() => {
    let currentIndex = 0;
    const heroIcon = document.getElementById("main__icon");

    const interval = setInterval(() => {
      heroIcon.innerHTML = yogaIcons[currentIndex];
      currentIndex = (currentIndex + 1) % yogaIcons.length;
    }, 1000);

    return () => clearInterval(interval);
  }, [yogaIcons]);

  return (
    <>
      <main className="h-full mx-6 mb-20 flex flex-col items-center justify-center md:flex-row md:p-12 md:gap-20 lg:h-[50vh] lg:max-w-[80rem] lg:px-32 lg:py-80 lg:mx-auto">
        <div className="text-center order-2 md:text-left md:order-1">
          <h5>Powered by AI 🌟</h5>
          <h1 className="text-5xl font-bold mt-2">
            Transform your day with your personal yoga trainer
          </h1>
          <p className="mt-4">
            Providing real-time feedback, guided sessions, and a library of
            beginner yoga exercises to improve posture, and enhance well-being.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 md:mt-9 md:flex-row md:justify-start md:gap-8">
            <NavLink to="/instructions">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Start Session
              </button>
            </NavLink>
            <NavLink to="/poses" className="text-blue-600 hover:underline">
              Learn Yoga
            </NavLink>
          </div>
        </div>

        <div
          id="main__icon"
          className="text-[75px] flex items-center justify-center order-1 md:order-2 md:text-[150px] md:w-[60%] lg:w-[50%] lg:text-[175px]"
        >
          🧘🏻‍♀️
        </div>
      </main>

      <section className="mx-6 -mt-6 mb-16 md:mx-12 lg:max-w-[80rem] lg:px-32 lg:mx-auto lg:mb-16">
        <h2 className="text-center text-2xl font-semibold mb-8">How it Works</h2>
        <ul className="flex flex-col gap-6 text-center md:flex-row md:gap-9 md:justify-between">
          <li className="bg-white p-6 rounded-[25px] border border-gray-400 md:w-1/2">
            <div className="w-full text-[48px] mb-2">📚</div>
            <h4 className="text-xl font-semibold mb-2">Learn Beginner Poses</h4>
            <p>
              We guide you through beginner yoga poses and educate you on their
              benefits, making it easy for anyone to get started.
            </p>
          </li>
          <li className="bg-white p-6 rounded-[25px] border border-gray-400 md:w-1/2">
            <div className="w-full text-[48px] mb-2">✅</div>
            <h4 className="text-xl font-semibold mb-2">Get Instant Feedback</h4>
            <p>
              Experience guided sessions with instant feedback, powered by AI,
              to improve your posture and overall well-being right from your
              fingertips.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
};

export default HomePage;
