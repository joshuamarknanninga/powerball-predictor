import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Graph({ results }) {
  const freq = {};
  results.forEach(r => r.numbers.forEach(n => freq[n] = (freq[n] || 0) + 1));
  const data = Object.entries(freq).map(([n, c]) => ({ number: n, count: c }));

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      <h2 className="text-xl mb-2 font-semibold">Number Frequency</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="number" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
