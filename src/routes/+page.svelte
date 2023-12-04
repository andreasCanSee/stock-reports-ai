<script>
    import TickerInput from '../components/TickerInput.svelte';
    import TickerDisplay from '../components/TickerDisplay.svelte';
    import ReportContainer from '../components/ReportContainer.svelte';
    import { fetchApi } from '../lib/api.js';
    import { dates } from '../lib/dateHelpers';
    import { selectedStocks } from '../stockStore';

    let currentPanel = 'selection';
    let stockReportData = null;

    async function generateReports(){
        currentPanel = 'loading';
        try{
            const stockDataPromises = $selectedStocks.map(stock => 
                fetchApi(`http://localhost:3000/api/stock-data/generate-report?ticker=${stock.ticker}&from=${dates.startDate}&to=${dates.endDate}`)
            );
            stockReportData = await Promise.all(stockDataPromises);
            currentPanel = 'output';
        } catch(error){
            console.error('Error fetching stock data:', error);
            currentPanel = 'selection';
        }
    }

    function backToSelection(){
        currentPanel = 'selection';
        stockReportData = null;
    }
</script>

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
                    <p>Your tickers will appear here...</p>
                {/if}
                <button class="generate-report-btn" type="button" disabled={$selectedStocks.length === 0} on:click={generateReports}>Generate Reports</button>
            </div>
        </section>
    {:else if currentPanel === 'loading'}
        <section class="loading-panel">
            <img src="loader.svg" alt="loading">
            <div id="api-message">Querying API...</div>
        </section>
    {:else if currentPanel === 'output'}
        <section class="output-panel">
            {#each $selectedStocks as stock}
                {@const report = stockReportData.find(s => s.ticker === stock.ticker)?.report || "No report available"}
                <ReportContainer {stock} {report}/>
            {/each}
            <button on:click={backToSelection} class="back-to-selection-btn">
                Back to Selection
            </button>
        </section>
    {/if}
</main>

<footer>
    &copy; This is not real financial advice!
</footer>

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

    .generate-report-btn {
        width: 70%;
        padding: 1em 1.5em;
        cursor: pointer;
        border: 2px solid #000000;
        background-color: #46ff90;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: .09em;
        font-size: 105%;
    }
    
    .selection-panel, .output-panel {
        line-height: 1.4em;
        margin: 1.5em 2em;
    
    }

    .loading-panel {
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
    }

</style>