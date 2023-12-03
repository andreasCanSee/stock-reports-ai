<script>
    import TickerSuggestion from './TickerSuggestion.svelte';
    import { userInputStore } from '../userInputStore';

    $: userInput = $userInputStore; // Reaktive Zuweisung
    let suggestedStocks = [] // List of stocks
  
    async function handleInput() {
      try {
        const response = await fetch(`http://localhost:3000/api/stock-data/ticker-search?q=${userInput}`);
        if (!response.ok) {
          throw new Error(`API request for Stock Ticker Search failed: ${response.statusText}`);
        }
        suggestedStocks = await response.json();
      } catch (error) {
        console.error('Error fetching tickers:', error);
      }
    }
  </script>


<input type="text" id="ticker-input" placeholder="Enter ticker" autocomplete="off" bind:value={$userInputStore}  on:input={handleInput}/>
<div class="ticker-suggestions">
    {#if suggestedStocks.length > 0}
        {#each suggestedStocks as stock (stock.ticker)}
        <TickerSuggestion {stock} />
        {/each}
    {:else}
      <p>No suggestions available</p>
    {/if}
  </div>