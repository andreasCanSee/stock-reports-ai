import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fetchStockData } from './api/stockDataApi.js'
import { fetchOpenAIResponse } from './api/openAIHelper.js'
import { getStockDataReportMessages, getCompanyInfoMessages, getCompanyLinksInfoMessages } from './api/openaiMessages.js'
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
app.get('/api/ticker-search', (req, res) => {
  const query = req.query.q.toLowerCase(); // Search term
  const tickers = getTickers(); // TO DO: optimize
  
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
      return res.json({ 
        status: "success",
        data: {
          ticker: ticker,
          report: cachedReport
        }
      });
    }

    const stockData = await fetchStockData(ticker, from, to);

    const stockDataMessages = getStockDataReportMessages(JSON.stringify(stockData));
    const stockReportResponse = await fetchOpenAIResponse(stockDataMessages);

    // Store in cache
    addReportToCache(ticker, stockReportResponse);

    res.json({ 
      status: "success",
      data: {
        ticker: ticker,
        report: stockReportResponse
      }
    });
  }

  catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
  }

});

app.get('/api/company-info', async (req, res) => {

  const { q: companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    const companyInfoMessages = getCompanyInfoMessages(companyName);
    const companyInfoResponse = await fetchOpenAIResponse(companyInfoMessages);
    res.json({ 
      status: "success",
      data: {
        companyName: companyName,
        description: companyInfoResponse
      }
    });
} catch (err) {
    console.error('Error fetching company info:', err);
    res.status(500).json({ status: "error", message: "Internal server error" });
}
});

const parseLinksResponse = (responseText) => {
  const bulletPoints = responseText.split('\n');
  return bulletPoints.map(point => {
      const [description, link] = point.split(': ').map(part => part.trim());
      const cleanedDescription = description.replace('- ', '');
      return { description: cleanedDescription, link };
  });
};

app.get('/api/company-links', async (req, res) => {
  const { q: companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    const companyLinksMessages = getCompanyLinksInfoMessages(companyName);
    const linksInfoResponse = await fetchOpenAIResponse(companyLinksMessages);
    const parsedLinks = parseLinksResponse(linksInfoResponse);
    res.json({ 
      status: "success",
      data: {
        companyName: companyName,
        links: parsedLinks
      }
    });
  } catch (err) {
    console.error('Error fetching company links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});