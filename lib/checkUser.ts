import { currentUser } from "@clerk/nextjs/server"
import { db } from '@/lib/prisma'
export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const loggedUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if (loggedUser) {
            return loggedUser;
        }

        const name = `${user.firstName} ${user.lastName}`.trim() || "New User";

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl || null,
                email: user.emailAddresses[0]?.emailAddress || '',
            }
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return null;
    }
}