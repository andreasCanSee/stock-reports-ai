// Function to display ticker suggestions
export function displayTickerSuggestions(stocks, onAddTicker) {
    const tickerInput = document.getElementById('ticker-input');
    const userInput = tickerInput.value.toLowerCase();
    const suggestionsDiv = document.querySelector('.ticker-suggestions');

    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    stocks.forEach(stock => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('ticker-suggestion');

        const tickerInfo = document.createElement('span');

        // Split the ticker into the highlighted part and the remaining part
        const highlightedPart = stock.ticker.substring(0, userInput.length);
        const remainingPart = stock.ticker.substring(userInput.length);

        // Create a strong element for the highlighted part
        const strongElement = document.createElement('strong');
        strongElement.textContent = highlightedPart;

        // Create an italicized element for the company name
        const emElement = document.createElement('em');
        emElement.textContent = stock.name;

        // Assemble the tickerInfo element
        tickerInfo.appendChild(strongElement);
        tickerInfo.appendChild(document.createTextNode(remainingPart + " - "));
        tickerInfo.appendChild(emElement);
        
        suggestionDiv.appendChild(tickerInfo);

        const addButton = document.createElement('button');
        addButton.textContent = 'ADD';
        addButton.classList.add('add-ticker-suggestion-btn');
        addButton.addEventListener('click', () => {
            onAddTicker({ ticker: stock.ticker, name: stock.name });
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

// Hide the loading area and clear any existing content in the report container
export function renderReport(stockDataArray, fetchCompanyInfoCallback, fetchCompanyLinksCallback) {
    const loadingArea = document.querySelector('.loading-panel')
    const outputArea = document.querySelector('.output-panel')
    const reportContainer = document.querySelector('.report-container')

    // Hide the loading area and clear any existing content in the report container
    loadingArea.style.display = 'none' 
    reportContainer.innerHTML = ''; 

    // Check if the stock data array is valid and non-empty
    if (!Array.isArray(stockDataArray) || stockDataArray.length === 0) {
        // Display an error message if the data is not an array or is empty
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "No Data available.";
        reportContainer.appendChild(errorMessage);
    } else {
        stockDataArray.forEach(stockData => {
            // Check if stockData has required properties
            if (stockData.ticker && stockData.report){
                 // Create a report card for each stock data
                const reportCard = document.createElement('div');
                reportCard.classList.add('report-card');

                // Add the ticker name in bold
                const tickerNameElement = document.createElement('strong');
                tickerNameElement.textContent = stockData.ticker;
                reportCard.appendChild(tickerNameElement);

                // Add the report content
                const reportElement = document.createElement('p');
                let reportContent = stockData.report;
                reportElement.textContent = reportContent;
                reportCard.appendChild(reportElement);

                // Add the company information accordion if applicable
                // Check if the report is long enough and doesn't contain "no" or "not"
                if (isValidForAccordion(stockData.report)) {
                    const companyInfoContainer = createCompanyInfoContainer(fetchCompanyInfoCallback, stockData.name);
                    reportCard.appendChild(companyInfoContainer);
                    const companyLinksContainer = createCompanyLinksContainer(fetchCompanyLinksCallback, stockData.name);
                    reportCard.appendChild(companyLinksContainer);
                }

                reportContainer.appendChild(reportCard);
            }else{
                // Handle errors for individual stock data
                const errorElement = document.createElement('p');
                errorElement.textContent = stockData.message || "Unknown Error";
                reportContainer.appendChild(errorElement);
            }
        })
    }
    // Display the output area
    outputArea.style.display = 'flex';
}

// Function to check if the report content is valid for displaying accordion
function isValidForAccordion(reportContent) {
    return reportContent.split('. ').length >= 3;
}

// Function to create the company information accordion container
function createCompanyInfoContainer(fetchCompanyInfoCallback, companyName) {

    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('accordion-container');
 
    // Accordion Header
    const accordionHeader = document.createElement('button');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.textContent = `Company Information [${companyName}]`;

    // Accordion Content
    const accordionContent = document.createElement('div');
    accordionContent.classList.add('accordion-content');
    accordionContent.style.display = 'none'; 

    // Placeholder Text for Loading
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Querying API...';
    accordionContent.appendChild(loadingText);

    let dataLoaded = false; 

    accordionHeader.addEventListener('click', function() {
         this.classList.toggle('active');
         const content = this.nextElementSibling;
         if (content.style.display === 'block') {
             content.style.display = 'none';
         } else {
             content.style.display = 'block';
             if (!dataLoaded) {
                 fetchCompanyInfoCallback(companyName)
                     .then(companyInfo => {
                        loadingText.style.display = 'none'; 
                        content.textContent = companyInfo; 
                        dataLoaded = true; 
                     })
                     .catch(error => {
                        loadingText.style.display = 'none'; 
                         content.textContent = 'Error loading company information.';
                     });
             }
         }
     });
 
    accordionContainer.appendChild(accordionHeader);
    accordionContainer.appendChild(accordionContent);
 
    return accordionContainer;
}

// Function to create the company information accordion container
function createCompanyLinksContainer(fetchCompanyLinksCallback, companyName) {

    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('accordion-container');
 
    // Accordion Header
    const accordionHeader = document.createElement('button');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.textContent = `Additional Sources [${companyName}]`;

    // Accordion Content
    const accordionContent = document.createElement('div');
    accordionContent.classList.add('accordion-content');
    accordionContent.style.display = 'none'; 

    // Placeholder Text for Loading
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Querying API...';
    accordionContent.appendChild(loadingText);

    let dataLoaded = false; 

    accordionHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
            if (!dataLoaded) {
                fetchCompanyLinksCallback(companyName)
                    .then(companyLinks => {
                        loadingText.style.display = 'none'; 
                        content.innerHTML = '';
                        const linksList = document.createElement('ul');
                        companyLinks.forEach(link => {
                            const listItem = document.createElement('li');
                            const cleanLink = link.link.replace(/[\[\]]/g, '');
                            listItem.innerHTML = `${link.description} ➡️ <a href="${cleanLink}" target="_blank">${cleanLink}</a>`;
                            linksList.appendChild(listItem);
                        });
                        content.appendChild(linksList);
                        dataLoaded = true;
                    })
                    .catch(error => {
                        loadingText.style.display = 'none'; 
                        content.textContent = 'Error loading company links.';
                    });
            }
        }
    });
 
    accordionContainer.appendChild(accordionHeader);
    accordionContainer.appendChild(accordionContent);
 
    return accordionContainer;
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

export function initializeBackToSelectionButton() {
    const backToSelectionButton = document.getElementById('back-to-selection-btn');
    const actionPanel = document.querySelector('.action-panel');
    const outputArea = document.querySelector('.output-panel');

    backToSelectionButton.addEventListener('click', () => {
        actionPanel.style.display = 'block'; // Action-Panel anzeigen
        outputArea.style.display = 'none';  // Output-Panel verstecken
    });
}