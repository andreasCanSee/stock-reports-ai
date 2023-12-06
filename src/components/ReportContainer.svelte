<script>
    import Accordion from '../components/Accordion.svelte';
    import { fetchApi } from '../lib/api.js';

    export let stock;
    export let report;

    let iconKeyword = getIconPath(report);

    function getIconPath(report) {

        if (!report) return 'investigate';
        
        const lastWord = report.split(' ').pop().toLowerCase();
        
        if (['buy', 'sell', 'hold'].includes(lastWord)) {
            return lastWord;
        }

        if (report.includes('BUY')) {
            return 'buy'; 
        }
        else if (report.includes('HOLD')) {
            return 'hold'; 
        }
        else if (report.includes('SELL')) {
            return 'sell'; 
        }
    
        return 'investigate';
    }

    async function fetchCompanyInfo(companyName){
        return fetchApi(`http://localhost:3000/api/company/info?q=${companyName}`)
            .then(data=>data.description)
            .catch(err=>"Error loading company information.")
    }

    async function fetchCompanyLinks(companyName){
        return fetchApi(`http://localhost:3000/api/company/links?q=${companyName}`)
            .then(data=>data.links)
            .catch(err=>"Error loading company links.")
    }
</script>

<div class="report-container bg-gray-100 p-8 mt-8 shadow-inner">
        <h3 class="text-2xl font-bold">{stock.ticker}</h3>
        <div class="report-data-container flex flex-col lg:flex-row items-center">
            <div class="report-data-text text-justify mr-4">
                <p>{report}</p>
            </div>
            <div class={`report-data-icon ${iconKeyword === 'sell' ? 'bg-red-100' : iconKeyword === 'buy' ? 'bg-green-100' : iconKeyword === 'hold' ? 'bg-blue-100' : 'bg-yellow-100'} mt-2 md:mt-0`}>
                <img src={`/${iconKeyword}.png`} alt="Icon" class="w-32 h-32 lg:max-w-xs lg:max-h-xs object-contain">
            </div>
        </div>
        <Accordion 
            title="Company Info"
            onToggle={() => fetchCompanyInfo(stock.name)} />

        <Accordion 
            title="Additional Sources"
            onToggle={() => fetchCompanyLinks(stock.name)} />
</div>

