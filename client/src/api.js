const BASE_URL = "http://localhost:5000/api";

export const getResults = async () => (await fetch(`${BASE_URL}/results`)).json();
export const scrapeNow = async () => (await fetch(`${BASE_URL}/scrape`, { method: "POST" })).json();
export const getPrediction = async () => (await fetch(`${BASE_URL}/predict`)).json();
