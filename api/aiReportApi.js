// Using GPT-4 from OpenAi
import OpenAI from 'openai';
import openaiMessages from './openaiMessages.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fetchReport = async (data) => {
    const messages = openaiMessages(data);
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

export { fetchReport };