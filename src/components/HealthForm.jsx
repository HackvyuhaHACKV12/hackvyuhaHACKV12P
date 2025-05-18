// src/components/HealthForm.jsx
import { useState } from "react";
import RecommendationCard from "./RecommendationCard";
import fetchAsanaRecommendations from "../utils/fetchAsanaRecommendations";

const CONDITIONS = [
  "Back Pain", "Anxiety", "Diabetes", "PCOS", "Neck Pain", "Obesity", "Stress"
];

export default function HealthForm() {
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (condition) => {
    setSelected(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = await fetchAsanaRecommendations(selected);
    setResults(data);
    setLoading(false);
  };

  return (
   <div className="w-screen flex justify-center  ">

     <div className="max-w-5xl w-screen  mx-auto px-6 py-10 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-8">
        Select Health Conditions
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {CONDITIONS.map((cond) => (
          <button
            type="button"
            key={cond}
            onClick={() => toggleSelect(cond)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
              selected.includes(cond)
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:border-indigo-300"
            }`}
          >
            {cond}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || selected.length === 0}
          className="mt-10 bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Generating Recommendations..." : "Get Yoga Recommendations"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Recommended Yoga Asanas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((asana, index) => (
              <RecommendationCard key={index} asana={asana} />
            ))}
          </div>
        </div>
      )}
    </div>
   </div>
  );
}