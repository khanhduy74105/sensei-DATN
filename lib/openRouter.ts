import { decreaseBalance, isOutOfBalance } from '@/actions/payment';
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_KEY
});

export default async function getGeneratedAIContent(prompt: string) {
    const outOfBalance = await isOutOfBalance();
    if (outOfBalance) {
        throw Error('OUT_OF_BALANCE')
    }
    const completion = await openRouter.chat.send({
        model: 'google/gemini-2.5-flash',
        messages: [
            {
                role: 'system',
                content: `You are a helpful assistant that ALWAYS responds in English.

                    CRITICAL RULES:
                    - You must respond in English only
                    - Even if the user writes in another language, respond in English
                    - Translate the user's question to English first, then answer in English
                    - Never use any language other than English in your responses`
            }
            ,
            {
                role: 'user',
                content: prompt,
            },
        ],
        stream: false,
    });

    await decreaseBalance()

    return {
        response: {
            text: () => (completion.choices[0].message.content as string)
        }
    }
}