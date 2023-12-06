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

<header class="flex justify-center items-center">
    <img src="skyline-data.png" alt="Stock Data Reports" class="w-500">
</header>

<main class="mx-auto p-4 max-w-4xl mt-8">
    {#if currentPanel === 'selection'}
        <section class="flex flex-col md:flex-row">
            <div class="user-input flex flex-col w-full md:w-1/2 px-2 md:mr-24">
                <label for="ticker-input" class="text-xl mb-2">Add up to 5 stock tickers below for generating reports:</label>
                <TickerInput />
            </div>
            <div class="user-display flex flex-col w-full mt-6 md:mt-0 md:w-1/2 px-2">
                <p class="text-xl">Your selected stock tickers: ({$selectedStocks.length}/5)</p>
                <div class="ticker-display-container  mt-2">
                {#if $selectedStocks.length > 0}
                    {#each $selectedStocks as stock}
                        <TickerDisplay ticker={stock.ticker} days={stock.days}/>
                    {/each}
                {:else}
                    <div class="ticker-box flex flex-col md:flex-row justify-between items-center bg-gray-700 text-white py-3 mt-1 pl-3 pr-3 w-2/3">
                        Your selected tickers will appear here...
                    </div>
                {/if}
                </div>

                <button on:click={generateReports} disabled={$selectedStocks.length === 0} class="bg-blue-900 text-white uppercase py-4 px-4 mt-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 ease-in-out cursor-pointer disabled:bg-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled: shadow-xl">
                    Generate Report{$selectedStocks.length === 1 ? '' : 's' }
                </button>
            </div>
        </section>
    {:else if currentPanel === 'loading'}
        <section class="flex flex-col justify-center items-center h-full">
            <img class="mb-4" src="loader.svg" alt="loading">
            <LoadingAnimation/>
        </section>
    {:else if currentPanel === 'output'}
        <section>
            {#each $selectedStocks as stock}
                {@const report = stockReportData.find(s => s.ticker === stock.ticker)?.report || "No report available"}
                <ReportContainer {stock} {report}/>
            {/each}
            <div class="flex justify-center">
                <button class="bg-gray-700 text-white uppercase py-4 px-4 mt-8 rounded-lg w-1/3 hover:bg-gray-500  transition-colors duration-300 ease-in-out  cursor-pointer" on:click={backToSelection}>
                    Back to Selection
                </button>
            </div>
        </section>
    {/if}
    <div class="border-t border-gray-800 mt-8"></div>
</main>

<footer class="text-center">
    <p class="text-sm">&copy; This is not real financial advice!</p>
</footer>

<style>

    /* Only for Help in Designing 
    div, main, section {
        border: black dashed;
    }*/
    
</style>