import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrape the official Powerball site for latest results.
 * If the HTML layout fails, attempt fallback via Powerball API.
 */
export const scrapePowerball = async () => {
  try {
    console.log("🔍 Scraping latest Powerball results...");

    const { data: html } = await axios.get("https://www.powerball.com/");
    const $ = cheerio.load(html);

    const drawDate = $(".draw-date").first().text().trim() ||
                     $(".date").first().text().trim();

    const numbers = [];
    $(".powerball-number").each((i, el) => {
      const text = $(el).text().trim();
      if (text && /^\d+$/.test(text)) numbers.push(parseInt(text));
    });

    const powerball = parseInt($(".powerball").first().text().trim()) || numbers.pop();

    const jackpotText = $(".jackpot-amount").first().text().trim() || "Unknown";
    const multiplier = parseInt($(".multiplier").first().text().trim()) || 1;

    if (!drawDate || numbers.length < 5 || !powerball) {
      throw new Error("Incomplete scrape data – attempting fallback...");
    }

    console.log(`✅ Scraped draw: ${drawDate}`);
    return {
      date: drawDate,
      numbers: numbers.slice(0, 5),
      powerball,
      jackpot: jackpotText,
      multiplier
    };
  } catch (err) {
    console.error("⚠️ Scraping failed, trying API fallback:", err.message);

    try {
      const { data } = await axios.get("https://data.ny.gov/resource/d6yy-54nr.json?$limit=1&$order=draw_date DESC");
      const draw = data[0];

      const numbers = [
        parseInt(draw.white_ball_1),
        parseInt(draw.white_ball_2),
        parseInt(draw.white_ball_3),
        parseInt(draw.white_ball_4),
        parseInt(draw.white_ball_5)
      ];

      const powerball = parseInt(draw.red_ball);
      const drawDate = new Date(draw.draw_date).toLocaleDateString();

      console.log(`✅ API Fallback success: ${drawDate}`);
      return {
        date: drawDate,
        numbers,
        powerball,
        jackpot: draw.jackpot || "Unknown",
        multiplier: parseInt(draw.multiplier) || 1
      };
    } catch (fallbackErr) {
      console.error("❌ API fallback failed:", fallbackErr.message);
      return null;
    }
  }
};
