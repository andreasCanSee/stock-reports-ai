<script>
import TickerInput from '../components/TickerInput.svelte';
import TickerDisplay from '../components/TickerDisplay.svelte';
import { selectedStocks } from '../stockStore';
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
                <button class="generate-report-btn" type="button" disabled>Generate Reports</button>
            {:else}
                <p>Your tickers will appear here...</p>
            {/if}
        </div>
    </section>
</main>