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

                   CRITICAL RULES (must be followed strictly):
                    - You MUST respond in English only.
                    - Even if the user writes in another language, respond ONLY in English.
                    - You MAY internally translate the user's input to English to understand it.
                    - You MUST NOT show, mention, or include the translation in your response.
                    - Do NOT explain that you translated the input.
                    - Only provide the final answer in English.`
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