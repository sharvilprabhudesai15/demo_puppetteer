async function scrapeCromaProduct(searchTerm) {
    const cromaUrl =
      'https://www.croma.com/searchB?q=' +
      searchTerm.replace(/ /g, "%20") +
      "%3Arelevance&text=" +
      searchTerm.replace(/ /g, "%20");
  
    try {
      const response = await fetch(cromaUrl);
      const htmlContent = await response.text();
      
      const $ = cheerio.load(htmlContent);
      
      const title = $(".product-title a").first().text().trim() || "Product not found";
      
      // Display the result in the browser
      document.getElementById("result").innerText = title;
    } catch (error) {
      console.error("Error:", error.message);
      document.getElementById("result").innerText = "Error fetching data";
    }
  }
  