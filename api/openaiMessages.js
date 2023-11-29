// Structure for OpenAI messages
const openaiMessages = (data) => {
    return [
      {
        role: 'system',
        content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.'
      },
      {
        role: 'user',
        content: data
      }
    ];
  };
  
  export default openaiMessages;