import express from 'express';
import cors from 'cors';
import { getStockData } from './stockDataApi.js';
import { fetchReport } from './aiReportApi.js';

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

// Endpoint that serves as a proxy
app.get('/api/stock-data', async (req, res) => {
  const { ticker, from, to } = req.query; // Parameter aus der URL extrahieren
  try{
    const stockData = await getStockData(ticker, from, to);
    const openAIResponse = await fetchReport(JSON.stringify(stockData));
    res.json(openAIResponse);
  }
  catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});