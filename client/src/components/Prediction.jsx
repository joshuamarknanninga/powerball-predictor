import React from "react";

export default function Prediction({ prediction }) {
  if (!prediction.prediction) return null;
  const nums = prediction.prediction.slice(0,5);
  const powerball = prediction.prediction[5];

  return (
    <div className="bg-green-100 border border-green-400 p-4 rounded-2xl mb-4 text-center">
      <h3 className="text-lg font-semibold mb-2">Predicted Numbers:</h3>
      <div className="flex justify-center gap-2">
        {nums.map(n => <span key={n} className="text-lg bg-green-500 text-white px-3 py-1 rounded-full">{n}</span>)}
        <span className="text-lg bg-red-600 text-white px-3 py-1 rounded-full">{powerball}</span>
      </div>
    </div>
  );
}
