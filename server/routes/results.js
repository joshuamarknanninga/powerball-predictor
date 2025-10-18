import express from "express";
import Result from "../models/Result.js";
import { scrapePowerball } from "../scraper.js";
import { predictNumbers } from "../results/predict.js";

const router = express.Router();

/**
 * @route GET /api/results
 * @desc Fetch recent Powerball results
 */
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 }).limit(100);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results." });
  }
});

/**
 * @route POST /api/results/scrape
 * @desc Scrape the latest Powerball results and log to MongoDB
 */
router.post("/scrape", async (req, res) => {
  try {
    const data = await scrapePowerball();
    if (!data) return res.status(500).json({ error: "Scraping failed." });

    const exists = await Result.findOne({ date: data.date });
    if (exists) {
      return res.json({ success: false, message: "Result already logged.", data: exists });
    }

    const result = await Result.create(data);
    res.status(201).json({ success: true, result });
  } catch (err) {
    console.error("Scrape route error:", err);
    res.status(500).json({ error: "Scrape route failed." });
  }
});

/**
 * @route GET /api/results/predict
 * @desc Generate Powerball number predictions based on historical data
 */
router.get("/predict", async (req, res) => {
  try {
    const prediction = await predictNumbers();
    res.status(200).json(prediction);
  } catch (err) {
    console.error("Prediction route error:", err);
    res.status(500).json({ error: "Prediction failed." });
  }
});

/**
 * @route DELETE /api/results/clear
 * @desc Clear all stored Powerball results (Admin use only)
 */
router.delete("/clear", async (req, res) => {
  try {
    const count = await Result.countDocuments();
    await Result.deleteMany({});
    res.json({ success: true, message: `Deleted ${count} results.` });
  } catch (err) {
    console.error("Clear route error:", err);
    res.status(500).json({ error: "Failed to clear results." });
  }
});

export default router;
