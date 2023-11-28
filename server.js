import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;

// Ermöglicht das Parsen von JSON-Body in POST-Anfragen
app.use(express.json());

// Aktivieren Sie CORS für Ihre Express-Anwendung
app.use(cors());
/*
    app.use(cors({
    origin: 'http://127.0.0.1:5500' // Erlauben Sie nur Anfragen von dieser Herkunft
    }));
*/

/*
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const messages = [
  {
    role: 'system',
    content: 'You are a helpful general knowledge expert.'
  },
  {
    role: 'system',
    content: 'Who invented the television?'
  }
]

// OpenAI Middleware
async function callOpenAI() {
  // Logik, um die OpenAI API anzusteuern
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages
  })
  return response
}

// Neuer Endpunkt für OpenAI-Anfragen
app.post('/api/generate-text', async (req, res) => {
  const { prompt } = req.body;
  try {
    const openAIResponse = await callOpenAI(prompt);
    res.json(openAIResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});*/


// Endpoint, der als Proxy dient
app.get('/api/stock-data', async (req, res) => {
  const { ticker, from, to } = req.query; // Parameter aus der URL extrahieren
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`;

  try {
    const polygonResponse = await fetch(url, {
      headers: {
        // Hier fügen Sie Ihren API-Schlüssel ein, der im .env gespeichert ist
        'Authorization': `Bearer ${process.env.POLYGON_API_KEY}`
      }
    });

    // Überprüfen, ob die Anfrage erfolgreich war
    if (!polygonResponse.ok) {
        const errorBody = await polygonResponse.text();
        console.log(`Antwort-Body bei Fehler: ${errorBody}`);
        throw new Error(`API-Anfrage fehlgeschlagen: ${polygonResponse.statusText}`);
    }

    const data = await polygonResponse.json();
    res.json(data); // Die Antwort der externen API an das Frontend weiterleiten

    // const openAIResponse = await callOpenAI()
    // console.log(openAIResponse) 

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
  }


});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
