import express from 'express';
import cors from 'cors';
import fs from 'fs';
import companyInfoRoutes from './apiRoutes/companyInfoRoutes.js';
import stockDataRoutes from './apiRoutes/stockDataRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

let tickersData;
try {
  /*  Load the tickers.json file:
      In Node.js, paths in modules are resolved relative to the current working directory 
      of the process, not relative to the directory of the file in which the code is written
  */
  const data = fs.readFileSync('./data/tickers.json', 'utf8');
  tickersData = JSON.parse(data);
} catch (err) {
  console.error('Error reading tickers file:', err);
  tickersData=[];
}

// Middleware

// Allows parsing of JSON body in POST requests
app.use(express.json());

// Enable CORS for your Express application
app.use(cors());
/*app.use(cors({
    origin: 'http://127.0.0.1:5500', 
  }));*/

app.use('/api/stock-data', (req, res, next) => {
  req.tickersData = tickersData;
  next();
  }, stockDataRoutes);
app.use('/api/company', companyInfoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});