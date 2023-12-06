<script>
    import { selectedStocks } from '../stockStore'
    import { userInputStore } from '../userInputStore';
    import { createEventDispatcher } from 'svelte';

    export let stock;
    export let clearSuggestions;

    let message = '';
    let type = '';

    const dispatch = createEventDispatcher();

    let userInputValue;
    $: userInputValue = $userInputStore; 

    function addStock(){
        selectedStocks.update(currentStocks => {
          if (currentStocks.some(s => s.ticker === stock.ticker)) {
            message = 'You have already selected this ticker';
            type = 'error';
            clearSuggestions();
            return currentStocks;
          }
          else if (currentStocks.length >= 5) {
            message = 'You cannot select more than 5 tickers. Please remove one to add this ticker';
            type = 'error';
            return currentStocks; 
          }else{
            userInputStore.set(""); 
            message = 'Ticker successfully added to your selection';
            type = 'success';
            clearSuggestions();
            const stockWithDays = { ...stock, days: 3 };
            return [stockWithDays, ...currentStocks, ]; 
          }
        });
        dispatch('message', { text: message, type: type });
        console.log('Nach ADD:', $selectedStocks)
    }
</script>

  <div class="ticker-suggestion flex justify-between items-center mt-1 pl-3 pr-3 py-3 border-black rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white">
    <span>
      <span class="bg-gray-700 text-white">{stock.ticker.substring(0, userInputValue.length)}</span>{stock.ticker.substring(userInputValue.length)} 
      - <em>{stock.name}</em>
    </span>
    <button class="add-ticker-suggestion-btn bg-white text-black rounded-lg text-lg font-bold ml-2 py-1 px-3" on:click={addStock}>+</button>
  </div>

  