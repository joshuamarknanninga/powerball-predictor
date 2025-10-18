import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { scrapePowerball } from "./scraper.js";
import Result from "./models/Result.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

app.get("/api/results", async (req, res) => {
  const results = await Result.find().sort({ date: -1 }).limit(50);
  res.json(results);
});

app.post("/api/scrape", async (req, res) => {
  const data = await scrapePowerball();
  if (data) {
    const existing = await Result.findOne({ date: data.date });
    if (!existing) {
      await Result.create(data);
      res.json({ success: true, data });
    } else {
      res.json({ success: false, message: "Already logged" });
    }
  } else {
    res.status(500).json({ error: "Scrape failed" });
  }
});

app.get("/api/predict", async (req, res) => {
  const results = await Result.find();
  const freq = {};
  results.forEach(r => r.numbers.forEach(n => freq[n] = (freq[n] || 0) + 1));

  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]);
  const predicted = sorted.slice(0,5).map(n => parseInt(n[0]));
  const powerball = Math.floor(Math.random() * 26) + 1;

  res.json({ prediction: [...predicted, powerball] });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
