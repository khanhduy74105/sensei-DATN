"use server"

import { getAppUrl } from "@/lib/getAPpURL";
import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function getUserCredit() {
    const { userId } = await auth();
    if (!userId) {
        return null
    };

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            id: true
        },
    });

    if (!user) {
        return null;
    };

    const userCredit = await db.userCredit.findFirst({
        where: {
            userId: user.id
        }
    })

    return userCredit;
}

export async function decreaseBalance() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { UserCredit: true },
    });

    if (!user) throw new Error("User not found");



    const isOutOfBalance = !user.UserCredit?.isPaid && (user.UserCredit?.balance === 0 || user.UserCredit?.balance === null);

    if (!isOutOfBalance) {
        await db.userCredit.update({
            where: {
                userId: user.id
            },
            data: {
                balance: (user.UserCredit?.balance ?? 1) - 1
            }
        })
    }

}


export async function createCheckoutSession(pathName: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: 999, // $9.99
                    product_data: {
                        name: "Pro Plan – Unlimited AI",
                        description: "Unlimited AI usage forever",
                    },
                },
                quantity: 1,
            },
        ],
        success_url: `${getAppUrl()}${pathName}`,
        cancel_url: `${getAppUrl()}${pathName}`,
        metadata: {
            userId: user.id, // ⭐⭐⭐ QUAN TRỌNG NHẤT
        },
    });

    return session.url!;
}
