// server.js

const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

async function scrapeCromaProduct(searchTerm) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
        const cromaUrl =
            'https://www.croma.com/searchB?q=' +
            searchTerm.replace(/ /g, "%20") +
            "%3Arelevance&text=" +
            searchTerm.replace(/ /g, "%20");

        await page.goto(cromaUrl, { waitUntil: "networkidle2" });

        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);

        await fs.writeFile("output.txt", $.text());

        const title = $(".product-title a").text().trim() || " ";

        console.log(title);

        return title; // Return the scraped title
    } catch (error) {
        console.error("Error:", error.message);
        throw error; // Rethrow the error to handle it in the calling function
    } finally {
        await browser.close();
    }
}

app.get('/api/scrape', async (req, res) => {
    const searchTerm = req.query.searchTerm || "samsung s24"; // Default search term

    try {
        const title = await scrapeCromaProduct(searchTerm);
        res.json({ title });
    } catch (error) {
        res.status(500).json({ error: 'Error scraping data.' });
    }
});

module.exports = app; // Export the Express app
