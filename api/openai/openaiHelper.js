import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fetchOpenAIResponse = async (messages) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error('Error in OpenAI API request:', err);
        throw err;
    }
};

export { fetchOpenAIResponse };