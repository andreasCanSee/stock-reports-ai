// Function to display ticker suggestions
export function displayTickerSuggestions(tickers) {
    const tickerInput = document.getElementById('ticker-input');
    const suggestionsDiv = document.querySelector('.ticker-suggestions');
    const tickerSymbols = tickers.map(ticker => ticker.ticker);

    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    tickers.forEach(ticker => {
        const div = document.createElement('div');
        div.textContent = `${ticker.ticker} - ${ticker.name}`;
        div.addEventListener('click', () => {
            tickerInput.value = ticker.ticker;
            clearTickerSuggestions();
            updateAddButtonState(ticker.ticker, tickerSymbols);
        })
        suggestionsDiv.appendChild(div);
    });
}

// Function to render ticker symbols on the screen
export function renderTickers(tickers) {
    const tickerDisplay = document.querySelector('.ticker-choice-display');

    tickerDisplay.innerHTML = '' // Clears any existing ticker displays

    tickers.forEach(ticker => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickerDisplay.appendChild(newTickerSpan) // Adds each ticker symbol to the display
    })
}

// Function to clear ticker suggestions
export function clearTickerSuggestions() {
    const suggestionsDiv = document.querySelector('.ticker-suggestions');
    suggestionsDiv.innerHTML = '';
}

// Function to render the report data on the screen
export function renderReport(reports) {
    const loadingArea = document.querySelector('.loading-panel')
    const outputArea = document.querySelector('.output-panel')

    loadingArea.style.display = 'none' // Hides the loading area
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
            let reportContent = report.error ? report.error : report;
            // Removes unnecessary escape characters and quotes from the report content
            reportContent = reportContent.replace(/\\n/g, "\n").replace(/(^"|"$)/g, '');
            
            reportElement.textContent = reportContent;
            outputArea.appendChild(reportElement);
            outputArea.style.display = 'flex' // Makes the output area visible
        }
    })
}

export function updateAddButtonState(query, tickers) {
    const addButton = document.querySelector('.add-ticker-btn');
    const label = document.getElementsByTagName('label')[0];

    if(tickers.includes(query.toUpperCase())) {
        addButton.disabled = false;
        label.style.color = 'initial';
        label.textContent = 'Add up to 3 stock tickers below to get a super accurate stock predictions report👇';
    } else {
        addButton.disabled = true;
        label.style.color = 'red';
        label.textContent = 'Invalid ticker symbol. Please select a valid stock ticker.';
    }
}