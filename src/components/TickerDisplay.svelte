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

<div class="ticker-box">
    <span class="ticker-text">{ticker}</span>
    <select class="day-selector" bind:value={selectedDays} on:change={updateDays}>
        {#each dayOptions as day}
            <option value={day} selected={day === selectedDays}>{day} Day{day === 1 ? '' : 's'}</option>
    {/each}
    </select>
    <button class="remove-icon" on:click={removeTicker}>x</button>
</div>

<style>
    .ticker-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border: 1px solid #333;
        border-radius: 4px;
        margin-bottom: 10px;
        background-color: #f2f2f2;
    }
    
    .remove-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: red;
        padding: 0 10px;
        height: 20px;
    }
    
    .ticker-text{
        flex-grow: 1; 
        display: flex;
        align-items: center;
        justify-content: center; 
    
    }
</style>