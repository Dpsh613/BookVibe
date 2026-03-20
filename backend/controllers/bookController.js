import axios from "axios";
import NodeCache from "node-cache";
import { moodToTopic, eraToYears } from "../utils/mappings.js";

// Initialize cache. stdTTL is time-to-live in seconds.
// 86400 seconds = 24 hours. The books won't change, so cache them for a whole day!
const cache = new NodeCache({ stdTTL: 86400 });

const discoverBooks = async (req, res) => {
  try {
    const { mood, era } = req.query;

    // getting the mapped values, setting fiction as default
    const topicArray = moodToTopic[mood] || ["fiction", "classic"];
    const years = eraToYears[era] || { start: 1000, end: 1928 };

    // picking a random topic
    const selectedTopic =
      topicArray[Math.floor(Math.random() * topicArray.length)];

    // --- CACHE CHECK ---
    // Create a unique key for this exact search, e.g., "gothic-1800-1901"
    const cacheKey = `${selectedTopic}-${years.start}-${years.end}`;

    // If we already searched this today, return it INSTANTLY from memory
    if (cache.has(cacheKey)) {
      console.log(`⚡ Serving from cache: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        moodSelected: mood,
        eraSelected: era,
        results: cache.get(cacheKey),
      });
    }

    // --- IF NOT IN CACHE, CALL GUTENDEX ---
    // Encode the topic! "fairy tales" becomes "fairy%20tales"
    const encodedTopic = encodeURIComponent(selectedTopic);

    // build the gutendex api url
    const gutendexUrl = `https://gutendex.com/books?topic=${encodedTopic}&author_year_start=${years.start}&author_year_end=${years.end}`;

    console.log(`🐌 Fetching from API: ${gutendexUrl}`);

    // call gutendex
    const response = await axios.get(gutendexUrl);
    const books = response.data.results;

    // clean and format data for the frontend
    const formattedBooks = books
      .filter((book) => book.formats["application/epub+zip"])
      .map((book) => {
        return {
          id: book.id,
          title: book.title,
          author: book.authors.length > 0 ? book.authors[0].name : "Unknown",
          coverImage: book.formats["image/jpeg"] || null,
          readLink: book.formats["application/epub+zip"],
          subjects: book.subjects,
        };
      })
      .slice(0, 5); // only sending top 5 results to keep UI clean

    // --- SAVE TO CACHE ---
    // Save these 5 books into memory so the next user gets them instantly
    if (formattedBooks.length > 0) {
      cache.set(cacheKey, formattedBooks);
    }

    res.status(200).json({
      success: true,
      moodSelected: mood,
      eraSelected: era,
      results: formattedBooks,
    });
  } catch (error) {
    console.log("error fetching books:", error.message);
    res
      .status(500)
      .json({ success: false, message: "failed to discover books" });
  }
};

const proxyEpub = async (req, res) => {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({ message: "No URL provided" });
    }

    console.log(`🔄 Proxying EPUB from: ${targetUrl}`);

    // Fetch the file as a stream from Gutenberg
    const response = await axios.get(targetUrl, {
      responseType: "stream",
    });

    // Set the headers so your React app knows it's an EPUB and allows CORS
    res.setHeader("Content-Type", "application/epub+zip");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Pipe the data directly to the frontend
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ message: "Failed to fetch EPUB" });
  }
};

export { discoverBooks, proxyEpub };
