<script>

import { selectedStocks } from '../stockStore.js';
export let ticker;

function removeTicker(){
    selectedStocks.update(stocks => stocks.filter(s => s.ticker !== ticker));
}
</script>

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

<div class="ticker-box">
    <span class="ticker-text">{ticker}</span>
    <button class="remove-icon" on:click={removeTicker}>x</button>
</div>