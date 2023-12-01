// Importing date utility functions
import { dates } from './utils/dates.js'
import { debounce } from './utils/debounce.js'
import { renderTickers, displayTickerSuggestions, clearTickerSuggestions, renderReport, updateAddButtonState } from './utils/uiHelpers.js';

// Array to store ticker symbols entered by the user
let chosenTickers = []
let suggestions = [];
let tickerSymbols = [];

// Add event listener to the ticker input field with debounce
document.getElementById('ticker-input').addEventListener('input', debounce(handleTickerInput, 300));

// Function to handle ticker input event
async function handleTickerInput(event){
    const query = event.target.value;
    if(query.length>0){
       try{
        const response = await fetch(`http://localhost:3000/api/searchTickers?q=${query}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        suggestions = await response.json();
        tickerSymbols = suggestions.map(suggestion => suggestion.ticker); // Speichert nur die Ticker-Symbole
        displayTickerSuggestions(suggestions);
        updateAddButtonState(query, tickerSymbols);
       }catch(error){
        console.error('Error fetching tickers:', error);
       }
    }else{
        // Clear suggestions if the query is empty
        clearTickerSuggestions();
    }
}

// Event listener for form submission
document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    const tickerInput = document.getElementById('ticker-input');
    const newTickerStr = tickerInput.value.toUpperCase(); // Convert to uppercase for consistency

    // Check if the entered ticker symbol is valid
    if (tickerSymbols.includes(newTickerStr)) {
        chosenTickers.push(newTickerStr); // Adds the ticker symbol to the array
        renderTickers(chosenTickers); // Calls function to update the display of tickers
        tickerInput.value = ''; // Clears the input field
        clearTickerSuggestions();
        generateReportBtn.disabled = false; // Enables the 'Generate Report' button
    } else {
        // If ticker symbol is invalid, display an error message
        const label = document.getElementsByTagName('label')[0];
        label.style.color = 'red';
        label.textContent = 'Invalid ticker symbol. Please select a valid stock ticker.';
    }
});

// Selecting DOM elements for later use
const loadingArea = document.querySelector('.loading-panel')
const generateReportBtn = document.querySelector('.generate-report-btn')

// Event listener for the 'Generate Report' button
generateReportBtn.addEventListener('click', fetchStockData)

// Async function to fetch stock data for each ticker symbol
async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex' // Shows the loading area
    try {
        const stockDataPromises = chosenTickers.map(async (ticker) => {
            // Constructs the URL for the API call
            const url = `http://localhost:3000/api/stock-data?ticker=${ticker}&from=${dates.startDate}&to=${dates.endDate}`;
            try {
                const response = await fetch(url); // Fetches data from the API
                if (!response.ok) {
                    throw new Error(`Error fetching data for ticker ${ticker}: ${response.statusText}`);
                }
                const data = await response.text(); // Parses the response text
                return data
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
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error('error: ', err)
    } 
}