"use server"

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

export async function isOutOfBalance() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) {
        throw new Error("Can not found user");
    }
    const userCredit = await db.userCredit.findFirst({
        where: {
            userId: user?.id
        }
    })
    return !userCredit?.isPaid && userCredit?.balance && userCredit?.balance <= 0;
}

export async function decreaseBalance() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const userCredit = await db.userCredit.findFirst({
        where: {
            userId: user.id
        }
    })
    const isOutOfBalance = !userCredit?.isPaid && userCredit?.balance && userCredit?.balance <= 0;

    if (!isOutOfBalance) {
        await db.userCredit.update({
            where: {
                userId: user.id
            },
            data: {
                balance: (userCredit?.balance ?? 1) - 1
            }
        })
    }

}


export async function createCheckoutSession() {
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
        success_url: `https://sensei-datn-lmae.vercel.app`,
        cancel_url: `https://sensei-datn-lmae.vercel.app`,
        metadata: {
            userId: user.id, // ⭐⭐⭐ QUAN TRỌNG NHẤT
        },
    });

    return session.url!;
}
