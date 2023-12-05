import fetch from 'node-fetch';
import fs from 'fs';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const API_URL = `https://api.polygon.io/v3/reference/tickers?apiKey=${POLYGON_API_KEY}`;

let allTickers = [];

const fetchTickers = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json();

        const tickers = data.results.map(item => {
            return { ticker: item.ticker, name: item.name };
        });
        allTickers.push(...tickers);

        console.log(tickers); // Zeigt die abgerufenen Daten an

        if (data.next_url) {
            const nextUrl = data.next_url + '&apiKey=' + POLYGON_API_KEY;
            setTimeout(() => fetchTickers(nextUrl), 12000); // Limit: 5 API Calls / Minute
        }else {
            // Alle Daten wurden abgerufen, schreiben Sie sie in eine Datei
            fs.writeFile('tickers.json', JSON.stringify(allTickers, null, 2), err => {
                if (err) throw err;
                console.log('Ticker data saved to tickers.json');
            });
        }

    } catch (error) {
        console.error('Error fetching tickers:', error);
    }
};

fetchTickers(API_URL);