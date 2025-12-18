import { OpenRouter } from '@openrouter/sdk';
import { model } from './genai';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_KEY
});

export default async function getGeneratedAIContent(prompt: string) {
    const completion = await openRouter.chat.send({
        model: 'google/gemini-2.5-flash',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        stream: false,
    });

    return {
        response: {
            text: () => (completion.choices[0].message.content as string)
        }
    }
}