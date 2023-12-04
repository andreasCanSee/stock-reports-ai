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

    .accordion-header {
        background-color: #727070;
        color: #ffffff;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        text-align: left;
        border: none;
        outline: none;
        transition: 0.4s;
    }
    
    .accordion-header:hover {
        background-color: #ccc;
        color: black;
    }
    
    .accordion-content {
        padding: 18px;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
        background-color: white;
    }
    
    .accordion-container {
        margin-bottom: 15px;
    }
    
    </style>