import React, { useState } from "react";

const NutritionAnalyser = () => {
  const [foodName, setFoodName] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Capitalize first letter of each word
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleInputChange = (e) => {
    setFoodName(capitalizeWords(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNutrition(null);
    try {
      const res = await fetch(`/api/nutrition?name=${encodeURIComponent(foodName)}`);
      if (!res.ok) throw new Error("Food not found");
      const data = await res.json();
      setNutrition(data);
      setFoodName(""); // Clear input after fetch
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFoodName("");
    setNutrition(null);
    setError("");
  };

  // Themed container and button (tailwind style, consistent with home)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-12">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-[#ecf39e33] p-8 md:p-12 w-full max-w-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#ecf39e] to-[#90a955] bg-clip-text text-transparent">Nutrition Analyser</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={foodName}
            onChange={handleInputChange}
            placeholder="Enter Food Name (e.g. Masala Dosa)"
            required
            className="flex-1 px-4 py-3 rounded-lg border border-[#ecf39e66] bg-black/40 text-white placeholder-[#ecf39e99] focus:outline-none focus:ring-2 focus:ring-[#90a955]"
          />
          <button
            type="submit"
            className="group flex justify-center items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#90a955] to-[#ecf39e] text-black rounded-full text-base sm:text-lg font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#ecf39e66] relative overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>{loading ? "Searching..." : "Analyse"}</span>
              <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🥗</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>
        <button
          className="w-full mb-4 py-3 rounded-lg bg-gradient-to-r from-[#ecf39e] to-[#90a955] text-black font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          onClick={e => {
            e.preventDefault();
            window.location.href = '/main/home';
          }}
        >
          ← Back to Home
        </button>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        {nutrition && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-[#ecf39e] text-center">{nutrition.name}</h3>
            <ul className="space-y-2 text-lg">
              <li><b>Calories:</b> {nutrition.calories}</li>
              <li><b>Protein:</b> {nutrition.protein}g</li>
              <li><b>Fat:</b> {nutrition.fat}g</li>
              <li><b>Carbs:</b> {nutrition.carbs}g</li>
              <li><b>Fiber:</b> {nutrition.fiber}g</li>
              <li><b>Sugar:</b> {nutrition.sugar}g</li>
              <li><b>Allergens:</b> {nutrition.allergens}</li>
              <li><b>Ayurvedic Profile:</b> {nutrition.ayurvedic_profile}</li>
              <li><b>Vegan:</b> {nutrition.vegan}</li>
              <li><b>Vegetarian:</b> {nutrition.vegetarian}</li>
              <li><b>Origin:</b> {nutrition.origin}</li>
              <li><b>Popularity Score:</b> {nutrition.popularity_score}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionAnalyser;
