const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

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

        console.log(title); // Log the title to the server console

        return "Success";
    } catch (error) {
        console.error("Error:", error.message);
        return "Error: " + error.message;
    } finally {
        await browser.close();
    }
}

app.get('/api/scrape', async (req, res) => {
    try {
        const result = await scrapeCromaProduct("samsung s24");
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Error scraping data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
