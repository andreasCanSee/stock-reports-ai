// using the Polygon API
import fetch from 'node-fetch';

const getStockData = async (ticker, from, to) => {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`;
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${process.env.POLYGON_API_KEY}` }
      });
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