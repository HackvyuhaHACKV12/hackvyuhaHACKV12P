// src/pages/Dashboard.jsx
import HealthForm from "../components/HealthForm";

export default function Dashboard() {
  return (
    <div className="p-6 w-screen mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Yoga Recommendations</h1>
      <HealthForm />
    </div>
  );
}