import axios from "axios";
import * as cheerio from "cheerio";

export const scrapePowerball = async () => {
  try {
    const { data } = await axios.get("https://www.powerball.com/");
    const $ = cheerio.load(data);

    const numbers = [];
    $(".powerball-number").each((i, el) => {
      numbers.push(parseInt($(el).text().trim()));
    });

    const date = $(".date").first().text().trim();
    return { date, numbers: numbers.slice(0, 5), powerball: numbers[5] };
  } catch (err) {
    console.error("Scraping failed:", err);
    return null;
  }
};
