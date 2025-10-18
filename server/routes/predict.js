import Result from "../models/Result.js";

/**
 * Predict Powerball numbers using frequency weighting.
 * MVP approach:
 *  - Count frequency of each number in historical data
 *  - Favor recently drawn numbers slightly
 *  - Randomly sample top candidates for balanced predictions
 */
export const predictNumbers = async () => {
  try {
    const results = await Result.find().sort({ date: -1 }).limit(500);
    if (!results.length) return { message: "No historical data available." };

    // frequency maps
    const freq = {};
    const recentWeight = {};

    results.forEach((r, i) => {
      const recencyBoost = Math.max(1, 1.5 - i * 0.001); // minor decay
      r.numbers.forEach(num => {
        freq[num] = (freq[num] || 0) + 1;
        recentWeight[num] = (recentWeight[num] || 0) + recencyBoost;
      });
    });

    // Normalize weighted scores
    const combined = Object.keys(freq).map(n => ({
      num: parseInt(n),
      weight: freq[n] * 0.7 + recentWeight[n] * 0.3
    }));

    // Sort by weighted score
    const sorted = combined.sort((a, b) => b.weight - a.weight);

    // Select top candidates (but shuffle slightly)
    const topCandidates = sorted.slice(0, 25);
    const shuffled = topCandidates.sort(() => 0.5 - Math.random());
    const predictedNumbers = shuffled.slice(0, 5).map(n => n.num).sort((a, b) => a - b);

    // Predict Powerball (simpler random pick weighted by recent draws)
    const powerballFreq = {};
    results.forEach(r => {
      powerballFreq[r.powerball] = (powerballFreq[r.powerball] || 0) + 1;
    });
    const topPowerballs = Object.entries(powerballFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(n => parseInt(n[0]));

    const powerball = topPowerballs[Math.floor(Math.random() * topPowerballs.length)];

    return {
      prediction: predictedNumbers,
      powerball,
      method: "frequency + recency weighted selection",
      totalDraws: results.length
    };
  } catch (err) {
    console.error("Prediction failed:", err);
    return { error: "Prediction error" };
  }
};
