<script>
    export let title;
    export let content = null;
    export let onToggle;

    let isOpen = false;

    async function toggleAccordion(){
        isOpen = !isOpen;
        if (isOpen && onToggle) {
            content = await onToggle();
        }
    }

    const isArray = (value) => Array.isArray(value);
</script>

<div class="accordion-container">
    <button class="accordion-header" on:click={toggleAccordion}>
        {title}
    </button>
    {#if isOpen}
        <div class="accordion-content">
            {#if content}
                {#if isArray(content)}
                    <ul>
                        {#each content as link}
                            <li>{link.description}: <a href={link.link} target="_blank">{link.link}</a></li>
                        {/each}
                    </ul>
                {:else}
                    <p>{content}</p>
                {/if}
            {:else}
                <p>Querying API...</p> 
            {/if}
        </div>
    {/if}
</div>

<style>

</style>