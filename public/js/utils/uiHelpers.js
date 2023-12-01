// Function to display ticker suggestions
export function displayTickerSuggestions(tickers, onAddTicker) {
    const tickerInput = document.getElementById('ticker-input');
    const userInput = tickerInput.value.toLowerCase();
    const suggestionsDiv = document.querySelector('.ticker-suggestions');

    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    tickers.forEach(ticker => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('ticker-suggestion');

        const tickerInfo = document.createElement('span');

        // Split the ticker into the highlighted part and the remaining part
        const highlightedPart = ticker.ticker.substring(0, userInput.length);
        const remainingPart = ticker.ticker.substring(userInput.length);

        // Create a strong element for the highlighted part
        const strongElement = document.createElement('strong');
        strongElement.textContent = highlightedPart;

        // Create an italicized element for the company name
        const emElement = document.createElement('em');
        emElement.textContent = ticker.name;

        // Assemble the tickerInfo element
        tickerInfo.appendChild(strongElement);
        tickerInfo.appendChild(document.createTextNode(remainingPart + " - "));
        tickerInfo.appendChild(emElement);
        
        suggestionDiv.appendChild(tickerInfo);

        const addButton = document.createElement('button');
        addButton.textContent = 'ADD';
        addButton.classList.add('add-ticker-suggestion-btn');
        addButton.addEventListener('click', () => {
            onAddTicker(ticker.ticker);
            clearTickerSuggestions();
            tickerInput.value = '';
        });
        suggestionDiv.appendChild(addButton);

        suggestionsDiv.appendChild(suggestionDiv);
    });
}

export function showDuplicateTickerError() {
    const label = document.getElementsByTagName('label')[0];
    label.style.color = 'red';
    label.textContent = 'This ticker has already been chosen.';
}

export function showMaxTickerError() {
    const label = document.getElementsByTagName('label')[0];
    label.style.color = 'red';
    label.textContent = 'You can only choose up to 5 tickers.';
}

// Function to render ticker symbols on the screen
export function renderTickers(tickers, onRemoveTicker) {
    const tickerDisplay = document.querySelector('.ticker-choice-display');

    tickerDisplay.innerHTML = '' // Clears any existing ticker displays
    
    tickers.forEach((ticker, index) => {
        const tickerBox = document.createElement('span')
        tickerBox.classList.add('ticker-box')

        const tickerText = document.createElement('span');
        tickerText.textContent = ticker;
        tickerBox.appendChild(tickerText);

        const removeIcon = document.createElement('span');
        removeIcon.textContent = ' x ';
        removeIcon.classList.add('remove-icon');
        removeIcon.addEventListener('click', () => onRemoveTicker(index));
        tickerBox.appendChild(removeIcon);
        
        tickerDisplay.appendChild(tickerBox) // Adds each ticker symbol to the display
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

// Function to show the loading area and hide the action panel
export function showLoadingArea() {
    const actionPanel = document.querySelector('.action-panel');
    const loadingArea = document.querySelector('.loading-panel');
    actionPanel.style.display = 'none';
    loadingArea.style.display = 'flex';
}

// Function to show error messages
export function showError(errorMessage) {
    const loadingArea = document.querySelector('.loading-panel');
    loadingArea.innerText = errorMessage;
    console.error(errorMessage);
}