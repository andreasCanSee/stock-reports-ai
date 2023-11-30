// Importing date utility functions
import { dates } from '../utils/dates.js'

// Array to store ticker symbols entered by the user
let tickersArr = []

// Event listener for form submission
document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault() // Prevents the default form submission behavior
    const tickerInput = document.getElementById('ticker-input') 
    const newTickerStr = tickerInput.value

    // Checks if the entered ticker symbol has more than 2 characters
    if (newTickerStr.length > 2){
        tickersArr.push(newTickerStr.toUpperCase()) // Adds the ticker symbol to the array
        renderTickers() // Calls function to update the display of tickers
        tickerInput.value = '' // Clears the input field
        generateReportBtn.disabled = false // Enables the 'Generate Report' button
    }
    else {
        // If ticker symbol is too short, display an error message
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
    }
})

// Function to render ticker symbols on the screen
function renderTickers() {
    const tickerDisplay = document.querySelector('.ticker-choice-display');
    tickerDisplay.innerHTML = '' // Clears any existing ticker displays
    tickersArr.forEach(ticker => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickerDisplay.appendChild(newTickerSpan) // Adds each ticker symbol to the display
    })
}

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
        const stockDataPromises = tickersArr.map(async (ticker) => {
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

// Function to render the report data on the screen
function renderReport(reports) {
    loadingArea.style.display = 'none' // Hides the loading area
    const outputArea = document.querySelector('.output-panel')
    outputArea.innerHTML = ''; // Clears any existing content in the output area

    reports.forEach(report => {
        if(report.error){
            // Handles errors for individual reports
            const errorElement = document.createElement('p');
            errorElement.textContent = report.error;
            outputArea.appendChild(errorElement);
        }else{
            // Renders the report content
            const reportElement = document.createElement('p');
            let reportContent = report
            // Removes unnecessary escape characters and quotes from the report content
            reportContent = reportContent.replace(/\\n/g, "\n").replace(/(^"|"$)/g, '');
            
            reportElement.textContent = reportContent;
            outputArea.appendChild(reportElement);
            outputArea.style.display = 'flex' // Makes the output area visible
        }
    })
}
