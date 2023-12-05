<script>
    import TickerInput from '../components/TickerInput.svelte';
    import TickerDisplay from '../components/TickerDisplay.svelte';
    import ReportContainer from '../components/ReportContainer.svelte';
    import LoadingAnimation from '../components/LoadingAnimation.svelte';
    import { fetchApi } from '../lib/api.js';
    import { selectedStocks } from '../stockStore';

    import './tailwind.css';

    let currentPanel = 'selection';
    let stockReportData = null;

    async function generateReports(){
        currentPanel = 'loading';
        try{
            const stockDataPromises = $selectedStocks.map(stock => 
               fetchApi(`http://localhost:3000/api/stock-data/generate-report?ticker=${stock.ticker}&days=${stock.days}`)
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

<main class="mx-auto p-4 max-w-4xl">
    {#if currentPanel === 'selection'}
        <section class="selection-panel flex flex-col md:flex-row">
            <div class="user-input flex flex-col w-full md:w-1/2 px-2">
                <label for="ticker-input" class="mb-2">Add up to 5 stock tickers below:</label>
                <TickerInput />
            </div>
            <div class="user-display flex flex-col w-full md:w-1/2 px-2">
                <p>Your Selection:</p>
                {#if $selectedStocks.length > 0}
                    {#each $selectedStocks as stock}
                        <TickerDisplay ticker={stock.ticker}/>
                    {/each}
                {:else}
                    <p>Your tickers will appear here...</p>
                {/if}

                <button class="generate-report-btn bg-blue-900 text-white uppercase py-4 px-4 rounded-none hover:bg-blue-800" type="button" disabled={$selectedStocks.length === 0} on:click={generateReports}>
                    Generate Reports
                </button>
            </div>
        </section>
    {:else if currentPanel === 'loading'}
        <section class="loading-panel flex flex-col justify-center items-center h-full">
            <img class="mb-4" src="loader.svg" alt="loading">
            <LoadingAnimation/>
        </section>
    {:else if currentPanel === 'output'}
        <section class="output-panel">
            {#each $selectedStocks as stock}
                {@const report = stockReportData.find(s => s.ticker === stock.ticker)?.report || "No report available"}
                <ReportContainer {stock} {report}/>
            {/each}
            <div class="flex justify-center">
                <button class="bg-gray-500 text-white uppercase py-4 px-4 rounded-none hover:bg-gray-700" on:click={backToSelection}>
                    Back to Selection
                </button>
            </div>
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
        margin: 0 auto;
    }
    
    header img {
        width: 500px;
    }

    footer {
        font-size: 14px;
        text-align: center;
    }
    
    /* Only for Help in Designing */
    div, main, section {
        border: black dashed;
    }

</style>