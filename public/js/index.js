// Importing date utility functions
import { dates } from './utils/dates.js'
import { debounce } from './utils/debounce.js'
import { renderTickers, displayTickerSuggestions, clearTickerSuggestions, renderReport, showLoadingArea, showError, showDuplicateTickerError, showMaxTickerError } from './utils/uiHelpers.js';

// Array to store ticker symbols entered by the user
let chosenTickers = []
let suggestions = [];

const generateReportBtn = document.querySelector('.generate-report-btn')

function onAddTicker(ticker) {
    // Check if the maximum number of tickers is reached
    if (chosenTickers.length >= 5) {
        showMaxTickerError();
        return;
    }

    // Check if the ticker is already selected
    if (chosenTickers.includes(ticker)) {
        showDuplicateTickerError();
        return;
    }

    // Add ticker and update UI
    chosenTickers.push(ticker);
    renderTickers(chosenTickers, onRemoveTicker);
    generateReportBtn.disabled = false; // Enables the 'Generate Report' button
}

// Add event listener to the ticker input field with debounce
document.getElementById('ticker-input').addEventListener('input', debounce(handleTickerInput, 200));

// Function to handle ticker input event
async function handleTickerInput(event){
    const query = event.target.value;
    if(query.length>0){
       try{
        const response = await fetch(`http://localhost:3000/api/ticker-search?q=${query}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        suggestions = await response.json();
        displayTickerSuggestions(suggestions, onAddTicker);
       }catch(error){
        console.error('Error fetching tickers:', error);
       }
    }else{
        clearTickerSuggestions(); // Clear suggestions if the query is empty
    }
}

function onRemoveTicker(index){
    chosenTickers.splice(index, 1)
    renderTickers(chosenTickers, onRemoveTicker)

    generateReportBtn.disabled = chosenTickers.length === 0;
}

// Event listener for the 'Generate Report' button
generateReportBtn.addEventListener('click', fetchStockData)

// Async function to fetch stock data for each ticker symbol
async function fetchStockData() {
    showLoadingArea();
    try {
        const stockDataPromises = chosenTickers.map(async (ticker) => {
            // Constructs the URL for the API call
            const url = `http://localhost:3000/api/stock-data?ticker=${ticker}&from=${dates.startDate}&to=${dates.endDate}`;
            try {
                const response = await fetch(url); // Fetches data from the API
                if (!response.ok) {
                    throw new Error(`Error fetching data for ticker ${ticker}: ${response.statusText}`);
                }

                const jsonResponse = await response.json(); // Parses the response as JSON
                if (jsonResponse.status === "success") {
                    return jsonResponse.data.report; // Access the report data
                } else {
                    throw new Error(jsonResponse.message || "Unknown error occurred");
                }
            }
            catch(err){
                console.error('Error in API request:', err);
                return { error: err.message };
            }
        });
        const stockData = await Promise.all(stockDataPromises)
        renderReport(stockData) // Calls function to render the fetched data
    } catch(err) {
        // Displays an error message and logs the error if the fetch operation fails
        showError('There was an error fetching stock data.');
    } 
}