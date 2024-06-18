// croma.js

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs").promises; // Using fs.promises for asynchronous file operations

async function scrapeCromaProduct(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const cromaUrl =
      'https://www.croma.com/searchB?q=' +
      encodeURIComponent(searchTerm);

    console.log("Navigating to:", cromaUrl);
    await page.goto(cromaUrl, { waitUntil: "networkidle2" });

    // Wait for the element with the specified selector to be present

    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();

    // Use Cheerio to load the HTML content
    const $ = cheerio.load(htmlContent);

    // Asynchronously write the text content to a file
    await fs.writeFile("output.txt", $.text());

    // Example of extracting product title
    const title = $(".product-title a").text().trim() || "No title found";
    console.log("Product Title:", title);

    return title; // Return the extracted title or data as needed
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeCromaProduct;
