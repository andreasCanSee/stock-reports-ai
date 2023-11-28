import { dates } from './utils/dates.js'

let tickersArr = []

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input') 
    const newTickerStr = tickerInput.value
    if (newTickerStr.length > 2){
        tickersArr.push(newTickerStr.toUpperCase())
         // console.log(tickersArr)
        renderTickers()
        tickerInput.value = ''
        generateReportBtn.disabled = false
    }
    else
    {
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
    }

})

function renderTickers() {
    const tickerDisplay = document.querySelector('.ticker-choice-display');
    tickerDisplay.innerHTML = ''
    tickersArr.forEach(ticker => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickerDisplay.appendChild(newTickerSpan)
    })
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')
const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async (ticker) => {
            const url = `http://localhost:3000/api/stock-data?ticker=${ticker}&from=${dates.startDate}&to=${dates.endDate}`;
            const response = await fetch (url);

            const data = await response.text();
            const status = response.status
            if (status === 200) {
                apiMessage.innerText = 'Creating report...'
                return data
            } else {
                loadingArea.innerText = 'There was an error fetching stock data.'
            }
        }))
        console.log(stockData.join(''))
    } catch(err) {
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error('error: ', err)
    } 
}

/*
async function fetchReport(data) {
    // AI goes here 
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = output
    outputArea.style.display = 'flex'
}
*/

