// croma.js

import puppeteer from "puppeteer";
import cheerio from "cheerio";

export async function scrapeCromaProduct(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const cromaUrl =
      'https://www.croma.com/searchB?q=' +
      encodeURIComponent(searchTerm);

    console.log("Navigating to:", cromaUrl);
    await page.goto(cromaUrl, { waitUntil: "networkidle2" });

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const title = $(".product-title a").text().trim() || "No title found";
    console.log("Product Title:", title);

    return title;
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Make sure to propagate the error so it can be caught
  } finally {
    await browser.close();
  }
}
