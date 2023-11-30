// using the Polygon API
import fetch from 'node-fetch';

const getStockData = async (ticker, from, to) => {
  
    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?apiKey=${POLYGON_API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data for ticker ${ticker}:`, error);
      throw error;
    }
  };
  
  export { getStockData };