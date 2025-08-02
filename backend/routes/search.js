// routes/search.js
const express = require("express");
const axios = require("axios");
const router = express.Router(); // Create an Express router

// Route is now relative to the mount point '/api/search' in server.js
// So, GET '/' here corresponds to GET /api/search
router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }
  const gutendexURL = `https://gutendex.com/books?search=${encodeURIComponent(
    query
  )}`;
  try {
    console.log(`(Route) Searching Gutendex for: ${query}`);
    const response = await axios.get(gutendexURL);
    const books = response.data.results
      ? response.data.results.map((item) => ({
          id: item.id,
          title: item.title,
          authors:
            item.authors.map((author) => author.name).join(", ") || "N/A",
        }))
      : [];
    console.log(`(Route) Found ${books.length} books on Gutendex`);
    res.json(books);
  } catch (error) {
    console.error(
      "(Route) Error fetching from Gutendex API:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Failed to fetch books from Gutendex API" });
  }
});

module.exports = router; // Export the router
