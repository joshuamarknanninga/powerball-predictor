import React from "react";

export default function ResultTable({ results }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl mb-2 font-semibold">Past Results</h2>
      <table className="w-full text-center">
        <thead>
          <tr><th>Date</th><th>Numbers</th><th>Powerball</th></tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.numbers.join(", ")}</td>
              <td className="text-red-600 font-bold">{r.powerball}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
