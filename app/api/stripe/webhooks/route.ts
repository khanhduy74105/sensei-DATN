import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import Stripe from "stripe";
select: { }

export async function POST(req: Request) {
    // 1️⃣ Lấy raw body
    const body = await req.text();

    // 2️⃣ Lấy signature
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return new Response("Missing stripe signature", { status: 400 });
    }

    let event: Stripe.Event;

    // 3️⃣ Verify webhook (RẤT QUAN TRỌNG)
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed", err);
        return new Response("Invalid signature", { status: 400 });
    }

    // 4️⃣ Handle event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const userId =
                    session.metadata?.userId ||
                    session.client_reference_id;

                if (!userId) {
                    console.error("❌ Missing userId in session");
                    return new Response("Missing userId", { status: 400 });
                }

                console.log('User ID', userId);
                

                const currentCredit = await db.userCredit.findUnique({
                    where: {
                        userId: userId
                    }
                })
                
                if (currentCredit) {
                    await db.userCredit.update({
                        where: {
                            userId: userId
                        },
                        data: {
                            isPaid: true
                        }
                    })
                } else {
                    db.userCredit.create({
                        data: {
                            userId: userId,
                            balance: 9999,
                            isPaid: true
                        }
                    })
                }


                console.log("✅ User upgraded:", userId);
                break;
            }

            default:
                console.log(`ℹ️ Unhandled event: ${event.type}`);
        }
    } catch (err) {
        console.error("❌ Webhook handler error:", err);
        return new Response("Webhook handler failed", { status: 500 });
    }

    // 6️⃣ Stripe cần 200 OK
    return new Response(JSON.stringify({ received: true }), { status: 200 });
}
