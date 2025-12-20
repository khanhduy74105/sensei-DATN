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