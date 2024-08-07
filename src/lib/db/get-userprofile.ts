import { prisma } from ".";

export async function getUserProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
        where: {
            profileId: userId
        },
        select: {
            about: true,
            user: {
                select: {
                    id: true,
                    image: true,
                    firstname: true,
                    lastname: true,
                    username: true
                }
            }
        }
    });

    return profile
}
