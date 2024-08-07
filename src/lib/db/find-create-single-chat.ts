import { prisma } from "."

export async function findOrCreateSingleChatWithUser(user1Id: string, user2Id: string) {
    let chat = await prisma.chat.findFirst({
        where: {
            users: {
                every: {
                    id: {
                        in: [user1Id, user2Id]
                    }
                }
            }
        },
        select: {
            id: true,
        }
    })

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                type: "Single",
                users: {
                    connect: [{
                        id: user1Id
                    }, {
                        id: user2Id
                    }]
                }
            },
            select: {
                id: true
            }
        })
    }


    return chat
}
