<script>
import TickerInput from '../components/TickerInput.svelte';
import TickerDisplay from '../components/TickerDisplay.svelte';
import Accordion from '../components/Accordion.svelte';
import { selectedStocks } from '../stockStore';
import { dates } from '../lib/dateHelpers';

let currentPanel = 'selection';
let stockReportData = null;

async function generateReports(){
    currentPanel = 'loading'
    try{
        const stockDataPromises = $selectedStocks.map(async (stock) => {
            const url = `http://localhost:3000/api/stock-data/generate-report?ticker=${stock.ticker}&from=${dates.startDate}&to=${dates.endDate}`;
            const response = await fetch(url);
            const jsonResponse = await response.json();
            return jsonResponse.data;
        });
        stockReportData = await Promise.all(stockDataPromises);
        // stockReportData = stockReports.map(data => data.report);
        currentPanel = 'output';
    } catch(error){
        console.error('Error fetching stock data:', error);
        currentPanel = 'selection';
    }
}

async function fetchCompanyInfo(companyName){
    try{
        const response = await fetch(`http://localhost:3000/api/company/info?q=${companyName}`);
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
                return jsonResponse.data.description;
            } else {
                throw new Error(jsonResponse.message || "Error in fetching company info response");
            }
    } catch (err){
        console.error('Error in fetching company info:', err);
        return { companyName, description: "Error loading company information." };
    }
}

async function fetchCompanyLinks(companyName){
    try{
        const response = await fetch(`http://localhost:3000/api/company/links?q=${companyName}`);
        const jsonResponse = await response.json();
        if (jsonResponse.status === "success") {
                return jsonResponse.data.links;
            } else {
                throw new Error(jsonResponse.message || "Error in fetching company links response");
            }
    } catch (err){
        console.error('Error in fetching company links:', err);
        return { companyName, description: "Error loading company links." };
    }
}

function backToSelection(){
    currentPanel = 'selection';
    stockReportData = null;
}
</script>

<style>
header {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
}

header img {
    width: 500px;
}

section.selection-panel {
  display: flex;
  justify-content: center; /* Center the content horizontally */
  align-items: center; /* Center the content vertically */
}

div.user-input {
  margin-right: 20px; /* Add space between the two divs */
}

.user-input {
  display: flex;
  flex-direction: column;
  padding: 1em;
  width: 300px;
}

/* footer */
footer {
    font-size: 14px;
    text-align: center;
}


/* Only for Help in Designing */
div {
    border: black dashed;
}

section {
    border: black dashed;
}




</style>

<header>
    <img src="skyline-data.png" alt="Stock Data Reports">
</header>

<main>
    {#if currentPanel === 'selection'}
        <section class="selection-panel">
            <div class="user-input">
                <label for="ticker-input">Add up to 5 stock tickers below:</label>
                <TickerInput />
            </div>
            <div class="user-display">
                <p>Your Selection:</p>
                {#if $selectedStocks.length > 0}
                    {#each $selectedStocks as stock}
                        <TickerDisplay ticker={stock.ticker}/>
                    {/each}
                    <button class="generate-report-btn" type="button" disabled={$selectedStocks.length === 0} on:click={generateReports}>Generate Reports</button>
                {:else}
                    <p>Your tickers will appear here...</p>
                {/if}
            </div>
        </section>
    {:else if currentPanel === 'loading'}
        <section class="loading-panel">
            <img src="loader.svg" alt="loading">
            <div id="api-message">Querying API...</div>
        </section>
    {:else if currentPanel === 'output'}
        <section class="output-panel">
            <div class="report-container">
                {#each $selectedStocks as stock}
                    <p>{stockReportData.find(s => s.ticker === stock.ticker)?.report || "No report available"}</p>
                    <Accordion 
                        title={`Company Info [${stock.name}]`}
                        onToggle={() => fetchCompanyInfo(stock.name)} />

                    <Accordion 
                        title={`Additional Sources [${stock.name}]`}
                        onToggle={() => fetchCompanyLinks(stock.name)} />
                {/each}
            </div>
            <button on:click={backToSelection} class="back-to-selection-btn">
                Back to Selection
            </button>
        </section>
    {/if}
</main>

<footer>
    &copy; This is not real financial advice!
</footer>