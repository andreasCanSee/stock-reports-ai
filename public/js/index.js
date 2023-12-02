// Importing date utility functions
import { dates } from './utils/dates.js'
import { debounce } from './utils/debounce.js'
import { renderTickers, displayTickerSuggestions, clearTickerSuggestions, renderReport, showLoadingArea, showError, showDuplicateTickerError, showMaxTickerError } from './utils/uiHelpers.js';
import { initializeBackToSelectionButton } from './utils/uiHelpers.js';

// Array to store ticker symbols entered by the user and corresponding company name
let selectedStocks = []; // Elements: { ticker: "AAPL", name: "Apple Inc." }

initializeBackToSelectionButton();
const generateReportBtn = document.querySelector('.generate-report-btn')

function onAddTicker(stock) {
    // Check if the maximum number of tickers is reached
    if (selectedStocks.length >= 5) {
        showMaxTickerError();
        return;
    }

    // Check if the ticker is already selected
    if (selectedStocks.some(s => s.ticker === stock.ticker)) {
        showDuplicateTickerError();
        return;
    }

    // Add ticker and update UI
    selectedStocks.push(stock);
    const tickers = selectedStocks.map(stock => stock.ticker); 
    renderTickers(tickers, onRemoveTicker);
    generateReportBtn.disabled = false; // Enables the 'Generate Report' button
}

function onRemoveTicker(index){
    selectedStocks.splice(index, 1)
    const tickers = selectedStocks.map(stock => stock.ticker)
    renderTickers(tickers, onRemoveTicker)
    generateReportBtn.disabled = selectedStocks.length === 0;
}

// Add event listener to the ticker input field with debounce
document.getElementById('ticker-input').addEventListener('input', debounce(handleTickerInput, 200));

// Function to handle ticker input event
async function handleTickerInput(event){
    const query = event.target.value;
    if(query.length>0){
       try{
        const response = await fetch(`http://localhost:3000/api/stock-data/ticker-search?q=${query}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const suggestedStocks = await response.json();
        displayTickerSuggestions(suggestedStocks, onAddTicker);
       }catch(error){
        console.error('Error fetching tickers:', error);
       }
    }else{
        clearTickerSuggestions(); // Clear suggestions if the query is empty
    }
}

// Event listener for the 'Generate Report' button
generateReportBtn.addEventListener('click', fetchStockData)

// Async function to fetch stock data for each ticker symbol
async function fetchStockData() {
    showLoadingArea();
    try {
        const stockDataPromises = selectedStocks.map(async (stock) => {
            // Constructs the URL for the API call
            const url = `http://localhost:3000/api/stock-data/generate-report?ticker=${stock.ticker}&from=${dates.startDate}&to=${dates.endDate}`;
            try {
                const response = await fetch(url); // Fetches data from the API
                if (!response.ok) {
                    throw new Error(`Error fetching data for ticker ${ticker}: ${response.statusText}`);
                }

                const jsonResponse = await response.json(); // Parses the response as JSON
                if (jsonResponse.status === "success") {
                    return jsonResponse.data; // Access the report data
                } else {
                    throw new Error(jsonResponse.message || "Unknown error occurred");
                }
            }
            catch(err){
                console.error('Error in API request:', err);
                return { error: err.message };
            }
        });

        const stockReports = await Promise.all(stockDataPromises)
        const stockData = stockReports.map(element => ({
            ticker: element.ticker,
            name: selectedStocks.find(stock => stock.ticker === element.ticker).name,
            report: element.report
        }));

        renderReport(stockData, fetchCompanyInfo, fetchCompanyLinks); // Calls function to render the fetched data
    } catch(err) {
        // Displays an error message and logs the error if the fetch operation fails
        showError('There was an error fetching stock data.');
    } 
}

// Function to fetch company information for a specific company
async function fetchCompanyInfo(companyName){
    try {
        const response = await fetch(`http://localhost:3000/api/company/info?q=${companyName}`);
        if (!response.ok) {
            throw new Error(`Error fetching company info for ${companyName}: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
            return jsonResponse.data.description; 
        } else {
            throw new Error(jsonResponse.message || "Unknown error occurred");
        }
    } catch (err) {
        console.error('Error in fetching company info:', err);
    }

}

// Function to fetch company links for a specific company
async function fetchCompanyLinks(companyName){
    try {
        const response = await fetch(`http://localhost:3000/api/company/links?q=${companyName}`);
        if (!response.ok) {
            throw new Error(`Error fetching company info for ${companyName}: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
            return jsonResponse.data.links; 
        } else {
            throw new Error(jsonResponse.message || "Unknown error occurred");
        }
    } catch (err) {
        console.error('Error in fetching company info:', err);
    }
}

const actionPanel = document.querySelector('.action-panel');
const backToSelectionButton = document.getElementById('back-to-selection-btn');
const outputArea = document.querySelector('.output-panel');

backToSelectionButton.addEventListener('click', () => {
    actionPanel.style.display = 'block'; // Action-Panel anzeigen
    outputArea.style.display = 'none';  // Output-Panel verstecken
});