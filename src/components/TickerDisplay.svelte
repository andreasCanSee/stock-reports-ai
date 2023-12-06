<script>
    import { selectedStocks } from '../stockStore.js';
    export let ticker;
    
    let selectedDays;
    const dayOptions = [1, 2, 3, 4, 5];

    // Initialize selectedDays with the current value from the store
    selectedStocks.subscribe(stocks => {
        const stock = stocks.find(s => s.ticker === ticker);
        if (stock) {
            selectedDays = stock.days;
        }
    });

    function updateDays(){
        selectedStocks.update(stocks =>
            stocks.map(s =>
                s.ticker === ticker ? {...s, days: selectedDays } : s
            )
        );
    }

    function removeTicker(){
        selectedStocks.update(stocks => stocks.filter(s => s.ticker !== ticker));
    }
</script>

<div class="ticker-box flex justify-between items-center bg-black text-white py-3 mt-1 pl-3 pr-3 w-2/3">
    <span class="ticker-text flex-auto truncate">{ticker}</span>
    <select class="day-selector text-black bg-white rounded-lg py-1 pl-1 w-1/3" title="Select Number of Days for Data Retrieval" bind:value={selectedDays} on:change={updateDays}>
        {#each dayOptions as day}
            <option class="bg-white" value={day} selected={day === selectedDays}>{day} Day{day === 1 ? '' : 's'}</option>
    {/each}
    </select>
    <button class="remove-icon bg-gray-200 text-black rounded-lg text-lg font-bold ml-2 py-1 px-3 ml-4" on:click={removeTicker}>x</button>
</div>