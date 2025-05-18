import Logo from "./../../assets/icons/logo.svg";
import githubIcon from "../../assets/icons/github.png";
import emailIcon from "../../assets/icons/email.svg";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white/40">
      <div className="w-full px-6 py-6 md:px-12 lg:max-w-screen-xl lg:mx-auto lg:px-32 lg:py-9">
        <div className="flex flex-col items-center text-center gap-4 md:flex-row md:justify-between md:text-left">
          {/* Left Side */}
          <div className="flex flex-col items-center md:items-start">
            <NavLink
              to="/"
              className="flex items-center gap-2 p-4 md:p-4 md:pl-0 text-black hover:bg-transparent"
            >
              <img
                className="w-15"
                src={Logo}
                alt="vector icon of a lotus flower"
              />
               <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-bold">
          YOG<span className="text-rose-500">AI</span>
        </span>
            </NavLink>
            <p className="text-sm mt-2">© Copyright {currentYear}</p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-2 pb-6 md:pb-5 md:pt-4 md:justify-end">
              <a
                href=""
                target="_blank"
                className="p-0 m-0 hover:bg-transparent"
              >
                <img
                  className="w-6 h-6"
                  src={githubIcon}
                  alt="GitHub icon"
                />
              </a>
              <a
                href=""
                target="_blank"
                className="p-0 m-0 hover:bg-transparent"
              >
                <img
                  className="w-6 h-6"
                  src={emailIcon}
                  alt="Email icon"
                />
              </a>
              <a
                href="https://linkedin.com/in/laura-nguyen"
                target="_blank"
                className="p-0 m-0 hover:bg-transparent"
              >
                <img
                  className="w-6 h-6"
                  src={linkedinIcon}
                  alt="LinkedIn icon"
                />
              </a>
            </div>
            <p className="text-sm">Made With ❤️ </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
