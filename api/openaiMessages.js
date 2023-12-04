// Structure for OpenAI messages
export const getStockDataReportMessages = (stockData) => {
    return [
      {
        role: 'system',
        content: `You are a financial data expert,
                  that is given data on share prices over the past 3 days.
                  Write a report of no more than 150 words.
                  First you describe the stocks performance.
                  Then you provide a reasoning for a recommendation.
                  In the last place you must always provide a single word recommendation: BUY, HOLD, or SELL.
                  Do not give disclaimers.`
      },
      {
        role: 'user',
        content: stockData
      }
    ];
};
  
export const getCompanyInfoMessages = (companyName) => {
  return [
    {
      role: 'system',
      content: `You are an industry expert. 
                Describe the business area and business model 
                of any given company in 3 sentences or less. 
                Include founding year and year of IPO if known.
                If you do not know the given company, 
                just acknowledge this in a simple sentence and 
                do not ask the user to do anything.`
    },
    {
      role: 'user',
      content: companyName
    }
  ];
}

export const getCompanyLinksInfoMessages = (companyName) => {
  return[
    {
      role: 'system',
      content: `You are a experienced business journalist. 
                If you have knowledge about the given company:
                provide a list of 3 links to general information about any given company.
                Follow the pattern for each bullet point:
                - [short link description]: [link]`
    },
    {
      role: 'user',
      content: companyName
    }
  ];

}