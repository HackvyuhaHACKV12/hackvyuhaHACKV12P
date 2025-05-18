import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found 😔</h1>
      <NavLink to="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200">
          Go to Homepage
        </button>
      </NavLink>
    </main>
  );
};

export default PageNotFound;
