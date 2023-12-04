<script>
    import { onMount, onDestroy } from 'svelte';

    let dots = '';
    let interval;

    function updateDots() {
        dots = dots.length < 3 ? dots + '.' : '';
    }

    onMount(() => {
        interval = setInterval(updateDots, 500); 
    });

    onDestroy(() => {
        clearInterval(interval); 
    });
</script>

<p>Querying API{dots}</p>
