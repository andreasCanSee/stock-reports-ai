<script>
    import { selectedStocks } from '../stockStore.js';
    export let ticker;
    export let days;

    const dayOptions = [1, 2, 3, 4, 5];

    function updateDays(newDays) {
        selectedStocks.update(stocks => {
            return stocks.map(stock => 
                stock.ticker === ticker ? { ...stock, days: newDays } : stock
            );
        });
    }

    function removeTicker() {
        selectedStocks.update(stocks => stocks.filter(stock => stock.ticker !== ticker));
    }

</script>

<div class="ticker-box flex justify-between items-center bg-gray-700 text-white py-3 mb-2 pl-3 pr-3 w-4/5">
    <span class="ticker-text flex items-center justify-center flex-auto truncate">{ticker}</span>
    <select bind:value={days} on:change={updateDays(days)} class="day-selector text-black bg-white rounded-lg py-1 pl-1 w-1/3" title="Select Number of Days for Data Retrieval">
        {#each dayOptions as day}
            <option class="bg-white" value={day}>{day} Day{day === 1 ? '' : 's'}</option>
    {/each}
    </select>
    <button on:click={removeTicker} class="remove-icon bg-gray-200 text-black rounded-lg text-lg font-bold ml-2 py-1 px-3 ml-4 hover:shadow-inner-strong hover:scale-97 transition duration-300 ease-in-out">x</button>
</div>