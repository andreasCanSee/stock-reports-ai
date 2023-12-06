<script>
  import TickerSuggestion from './TickerSuggestion.svelte';
  import { userInputStore } from '../userInputStore';

  $: userInput = $userInputStore; // Reaktive Zuweisung
  let suggestedStocks = [] // List of stocks

  let message = '';
  let messageType = '';

  function handleMessage(event) {
      const { text, type } = event.detail;
      message = text;
      messageType = type;
  }
  
  async function handleInput() {

    if(userInput){
      message='';
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
    else{
      clearSuggestions()
      return
    }
  }

  function clearSuggestions(){
     suggestedStocks = [];
  }
</script>

<input type="text" id="ticker-input" bind:value={$userInputStore} on:input={handleInput} placeholder="Enter ticker, e.g. AAPL" class="text-lg py-3 w-56 pl-3 focus:outline-none rounded-lg" autocomplete="off" maxlength="20"/>
<div class="ticker-suggestions">
  {#if message}
      <p class={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>{message}</p>
  {/if}
  {#if suggestedStocks.length > 0}
      {#each suggestedStocks as stock (stock.ticker)}
          <TickerSuggestion {stock} on:message={handleMessage} clearSuggestions={clearSuggestions}/>
      {/each}
  {/if}
</div>