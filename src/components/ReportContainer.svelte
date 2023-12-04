<script>
    import Accordion from '../components/Accordion.svelte';

    export let stock;
    export let report;

    function getIconPath(report) {

        if (!report){
            return 'investigate.png';
        }

        const lastWord = report.split(' ').pop().toLowerCase();

        if (['buy', 'sell', 'hold'].includes(lastWord)) {
            return `/${lastWord}.png`;
        }

        if (report.includes('BUY')) {
            return '/buy.png'; 
        }
        else if (report.includes('HOLD')) {
            return '/hold.png'; 
        }
        else if (report.includes('SELL')) {
            return '/sell.png'; 
        }
    
        return '/investigate.png';
    }

    async function fetchCompanyInfo(companyName){
        try{
            const response = await fetch(`http://localhost:3000/api/company/info?q=${companyName}`);
            const jsonResponse = await response.json();
            if (jsonResponse.status === "success") {
                    return jsonResponse.data.description;
                } else {
                    throw new Error(jsonResponse.message || "Error in fetching company info response");
                }
        } catch (err){
            console.error('Error in fetching company info:', err);
            return { companyName, description: "Error loading company information." };
        }
    }

    async function fetchCompanyLinks(companyName){
        try{
            const response = await fetch(`http://localhost:3000/api/company/links?q=${companyName}`);
            const jsonResponse = await response.json();
            if (jsonResponse.status === "success") {
                    return jsonResponse.data.links;
                } else {
                    throw new Error(jsonResponse.message || "Error in fetching company links response");
                }
        } catch (err){
            console.error('Error in fetching company links:', err);
            return { companyName, description: "Error loading company links." };
        }
    }
</script>

<div class="report-container">
        <h3>{stock.ticker}</h3>
        <div class="report-data-container">
            <div class="report-data-text">
                <p>
                    {report}
                </p>
            </div>
            <div class="report-data-icon">
                <img src={getIconPath(report)} alt="Icon" class="report-icon">
            </div>
        </div>
        <Accordion 
            title={`Company Info [${stock.name}]`}
            onToggle={() => fetchCompanyInfo(stock.name)} />

        <Accordion 
            title={`Additional Sources [${stock.name}]`}
            onToggle={() => fetchCompanyLinks(stock.name)} />
</div>

<style>
    .report-container {
        background-color: #f2f2f2; 
        border: 2px dashed #cccccc;
        padding: 15px;
        margin-bottom: 15px; 
        border-radius: 10px;
    }
    .report-data-container {
        display: flex;
        align-items: center; /* Vertikal zentrieren */
        justify-content: space-between; /* Platz zwischen Text und Icon */
        
    }

    .report-data-text {
        flex-grow: 1; /* Erlaubt dem Text-Container, den verfügbaren Platz auszufüllen */
        text-align: justify; /* Blocksatz für den Text */
    }

    .report-data-icon {
        margin-left: 15px; /* Platz zwischen Text und Icon */
    }

    .report-icon {
        width: 80px; /* Größe des Icons */
        height: auto;
    }
</style>