<script>
    import { selectedStocks } from '../stockStore'
    import { userInputStore } from '../userInputStore';
    
    export let stock;
    export let clearSuggestions;

    let userInputValue;
    $: userInputValue = $userInputStore; 

    function addStock(){
        selectedStocks.update(currentStocks => {
            if (currentStocks.length < 5 && !currentStocks.some(s => s.ticker === stock.ticker)){
              userInputStore.set("");
              return [...currentStocks, stock];
            }
            return currentStocks;
        })
        clearSuggestions();
    }
</script>

  <div class="ticker-suggestion">
    <span>
      <strong>{stock.ticker.substring(0, userInputValue.length)}</strong>{stock.ticker.substring(userInputValue.length)} 
      - <em>{stock.name}</em>
    </span>
    <button class="add-ticker-suggestion-btn" on:click={addStock}>ADD</button>
  </div>

  <style>
    .ticker-suggestion {
        display: flex; /* Use flexbox to arrange items horizontally */
        justify-content: space-between; /* Push items to both ends of the div */
        align-items: center; /* Vertically align items in the center */
        background-color: white; /* Hintergrundfarbe für die Sichtbarkeit */
        margin-top: 10px; /* Add more space between suggestions */
        width: 300px; /* Set a fixed width for each suggestion */
    }
    /* Style the ADD button */
  .add-ticker-suggestion-btn {
    margin-left: 10px; /* Add space between text and button */
  }
</style>
