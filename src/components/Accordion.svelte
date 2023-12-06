<script>
    import LoadingAnimation from "./LoadingAnimation.svelte";

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

<div class="accordion-container flex flex-col items-center mt-4">
    <button on:click={toggleAccordion} class="accordeon-header bg-blue-900 text-white uppercase py-4 px-4 mt-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 ease-in-out cursor-pointer">
        {content === null ? 'Generate' : 'Show'} {title}
    </button>
    {#if isOpen}
        <div class="accordion-content bg-white text-justify p-4 w-full">
            {#if content}
                {#if isArray(content)}
                    <ul class="list-disc list-inside">
                        {#each content as link}
                            <li>{link.description}: <a href={link.link} class="font-bold bg-gray-100 break-words" target="_blank">{link.link}</a></li>
                        {/each}
                    </ul>
                {:else}
                    <p>{content}</p>
                {/if}
            {:else}
                <LoadingAnimation /> 
            {/if}
        </div>
    {/if}
</div>