import { prisma } from ".";

export async function findUser(search: string) {

    return await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    firstname: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    lastname: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        },
        select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            image: true,
        }
    })
}
