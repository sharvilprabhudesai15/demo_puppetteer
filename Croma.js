const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs"); // Using fs.promises for asynchronous file operations
 
async function scrapeCromaProduct(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  try {
    const cromaUrl =
      'https://www.croma.com/searchB?q=' +
      searchTerm.replace(/ /g, "%20") +
      "%3Arelevance&text=" +
      searchTerm.replace(/ /g, "%20");
 
    console.log(cromaUrl);
    await page.goto(cromaUrl, { waitUntil: "networkidle2" });
 
    // Wait for the element with the specified selector to be present
 
    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();
 
    // Use Cheerio to load the HTML content
    const $ = cheerio.load(htmlContent);
 
    // Asynchronously write the text content to a file
    await fs.writeFile("output.txt", $.text());
 
    //console.log($.text());
 
    const title =
      $(".product-title a").text().trim() || " ";
 
    console.log(title);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
}
 
scrapeCromaProduct("samsung s24");