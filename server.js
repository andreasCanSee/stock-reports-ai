const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

/*
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Erlauben Sie nur Anfragen von dieser Herkunft
}));
*/

const PORT = process.env.PORT || 3000;


// Ihre API-Endpunkte und andere Serverlogik
app.get('/api/key', (req, res) => {
    // Senden Sie den API-Schlüssel nicht an den Client!
    // Senden Sie stattdessen nur den minimal notwendigen Daten oder führen Sie die API-Aufrufe hier durch.
    res.json({ apiKey: process.env.POLYGON_API_KEY });
  });

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});