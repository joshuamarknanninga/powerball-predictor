import React, { useEffect, useState } from "react";
import { getResults, getPrediction, scrapeNow } from "./api";
import Graph from "./components/Graph";
import ResultTable from "./components/ResultTable";
import Prediction from "./components/Prediction";

export default function App() {
  const [results, setResults] = useState([]);
  const [prediction, setPrediction] = useState([]);

  useEffect(() => {
    getResults().then(setResults);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">🎱 Powerball Predictor</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button className="btn" onClick={async () => setResults(await scrapeNow())}>Scrape Latest</button>
        <button className="btn" onClick={async () => setPrediction(await getPrediction())}>Predict Numbers</button>
      </div>
      <Prediction prediction={prediction} />
      <Graph results={results} />
      <ResultTable results={results} />
    </div>
  );
}
