'use server'
import { db } from '@/lib/prisma'
import { auth } from "@clerk/nextjs/server"
import { genarateAIIsignts } from './dashboard';

interface UpdateUserData {
    industry: string;
    experience: number;
    bio?: string;
    skills: string[];
}

export async function updateUser(data: UpdateUserData) {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    try {
        const result = await db.$transaction(async (tx) => {

            let industryInsights = await tx.industryInsight.findUnique({
                where: { industry: data.industry }
            });

            if (!industryInsights) {
                const insights = await genarateAIIsignts(data.industry);

                industryInsights = await tx.industryInsight.create({
                    data: {
                        industry: data.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                    }
                });
            }

            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    industry: data.industry,
                    experience: data.experience,
                    bio: data.bio,
                    skills: data.skills,
                }
            });

            return { user: updatedUser, industry: industryInsights };

        }, { timeout: 10000 });

        return {
            success: true,
            ...result
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating user and industry:', error.message);
            throw new Error('Failed to update user and industry' + error.message);
        }

    }
}


export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: {
                industry: true
            }
        });

        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        throw new Error('Failed to check onboarding status');
    }
}

export async function getUser() {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });
    if (!user) throw new Error('User not found');

    return user;
}

export async function checkUserCredits(userId: string) {
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { UserCredit: true },
    });

    if (!user) throw new Error("User not found");

    if (!user.UserCredit?.isPaid && (user.UserCredit?.balance || 0) <= 0) {
        return {
            success: false,
            error: "OUT_OF_BALANCE",
            user: null,
        };
    }

    return { success: true, user };
}