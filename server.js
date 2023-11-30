import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { getStockData } from './api/stockDataApi.js';
import { fetchReport } from './api/aiReportApi.js';
import { addReportToCache, getReportFromCache, clearOldCacheEntries } from './api/cacheManager.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Allows parsing of JSON body in POST requests
app.use(express.json());

// Enable CORS for your Express application
app.use(cors());
/*
    app.use(cors({
    origin: 'http://127.0.0.1:5500' // Erlauben Sie nur Anfragen von dieser Herkunft
    }));
*/
const getTickers = () => {
  // Load the tickers.json file
  const data = fs.readFileSync('data/tickers.json', 'utf8');
  return JSON.parse(data);
};

// API endpoint for ticker search
app.get('/api/searchTickers', (req, res) => {
  const query = req.query.q.toLowerCase(); // Search term
  const tickers = getTickers();
  
  // Filter tickers based on the search term, up to 3 results
  const filteredTickers = [];
  for (const ticker of tickers) {
      if (ticker.ticker.toLowerCase().startsWith(query)) {
          filteredTickers.push(ticker);
          if (filteredTickers.length === 3) {
              break; // Stop searching after finding 3 matches
          }
      }
  }

  res.json(filteredTickers);
});


// Endpoint that serves as a proxy
app.get('/api/stock-data', async (req, res) => {
  const { ticker, from, to } = req.query; // extract parameters from URL

  clearOldCacheEntries();  // -> node-cron

  try{
    // Check cache
    const cachedReport = getReportFromCache(ticker);
    if (cachedReport) {
      return res.json(cachedReport);
    }

    const stockData = await getStockData(ticker, from, to);
    const openAIResponse = await fetchReport(JSON.stringify(stockData));

    // Store in cache
    addReportToCache(ticker, openAIResponse);

    res.json(openAIResponse);
  }
  catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
  }

});

/*
app.get('/api/tickers', async (req, res) => {

});*/

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});