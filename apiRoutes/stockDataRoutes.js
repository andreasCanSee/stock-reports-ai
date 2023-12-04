import express from "express";
import { fetchStockData } from '../api/stockDataApi.js'
import { fetchOpenAIResponse } from '../api/openAIHelper.js'
import { getStockDataReportMessages } from '../api/openaiMessages.js'
import { addReportToCache, getReportFromCache, clearOldCacheEntries } from '../api/cacheManager.js';
import { getReportDates } from '../api/dateHelpers.js';

const router = express.Router();

// API endpoint for ticker search
router.get('/ticker-search', (req, res) => {
    const query = req.query.q.toLowerCase(); // Search term
    const tickers = req.tickersData;
    
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
router.get('/generate-report', async (req, res) => {
    const { ticker, days } = req.query; // extract parameters from URL
  
    // Clear old cache entries
    clearOldCacheEntries();  // -> node-cron
  
    try{
      const { startDate, endDate } = getReportDates(days);

      // Check cache
      const cachedReport = getReportFromCache(ticker, days);

      if (cachedReport) {
        return res.json({ 
          status: "success",
          data: {
            ticker: ticker,
            report: cachedReport
          }
        });
      }
  
      const stockData = await fetchStockData(ticker, startDate, endDate);
      const stockDataMessages = getStockDataReportMessages(JSON.stringify(stockData));
      const stockReportResponse = await fetchOpenAIResponse(stockDataMessages);
  
      // Store in cache
      addReportToCache(ticker, days, stockReportResponse);
  
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
  
export default router;