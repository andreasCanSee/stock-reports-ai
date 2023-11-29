import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import OpenAI from 'openai';
import openaiMessages from './openaiMessages.js';

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Allows parsing of JSON body in POST requests
app.use(express.json());

// Enable CORS for your Express application
app.use(cors());
/*
    app.use(cors({
    origin: 'http://127.0.0.1:5500' // Erlauben Sie nur Anfragen von dieser Herkunft
    }));
*/

// OpenAI Middleware
async function fetchReport(data) {

  const messages = openaiMessages(data);

  // Logic to control the OpenAI API
  try{
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    })
    return response.choices[0].message.content
  }
  catch (err) {
    console.error('Error bei der OpenAI API-Anfrage:', err);
    throw err;
  }
}

// Endpoint that serves as a proxy
app.get('/api/stock-data', async (req, res) => {
  const { ticker, from, to } = req.query; // Parameter aus der URL extrahieren
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`;

  try {
    const polygonResponse = await fetch(url, {
      headers: {
        // Insert your API key here, stored in .env
        'Authorization': `Bearer ${process.env.POLYGON_API_KEY}`
      }
    });

    // Check if the request was successful
    if (!polygonResponse.ok) {
        const errorBody = await polygonResponse.text();
        console.log(`Antwort-Body bei Fehler: ${errorBody}`);
        throw new Error(`API-Anfrage fehlgeschlagen: ${polygonResponse.statusText}`);
    }

    const stockData = await polygonResponse.json();

     // Requesting analysis from OpenAI
    const openAIResponse = await fetchReport(JSON.stringify(stockData));
    res.json(openAIResponse)

    /* Zusammenführen der Polygon-Daten und der OpenAI-Antwort
    const combinedResponse = {
      stockData: stockData,
      openAIAnalysis: openAIResponse 
    };

    // Senden der kombinierten Antwort an das Frontend
    res.json(combinedResponse);
    */

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});