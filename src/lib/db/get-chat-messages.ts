import { prisma } from ".";

export async function getChatMessages(chatId: string, userId: string, cursor: string | undefined) {

    const skip = cursor ? 1 : 0;

    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId
        },
        select: {
            id: true,
            type: true,
            messages: {
                where: {
                    deletedByUsers: {
                        none: {
                            id: userId
                        }
                    }
                },
                include: {
                    read: {
                        select: {
                            readAt: true,
                            user: {
                                select: {
                                    id: true,
                                    firstname: true,
                                    lastname: true,
                                    username: true,
                                    image: true
                                }
                            }
                        }
                    },
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 200,
                cursor: {
                    id: cursor
                },
                skip: skip
            },
            users: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    image: true,
                    username: true,
                }
            },
            GroupChatInfo: {
                include: {
                    admins: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                            image: true,
                            username: true,
                        }
                    }
                }
            }
        }
    })

    if (!chat) throw "Chat not Found"

    if (chat.type === "Single") {
        const other_user = chat.users.find(user => user.id != userId)!

        return {
            id: chat.id,
            type: chat.type,
            chat_name: other_user.firstname + " " + other_user.lastname,
            chat_image: other_user.image,
            messages: chat.messages,
            users: chat.users
        }
    } else {

        return {
            id: chat.id,
            type: chat.type,
            chat_name: chat.GroupChatInfo!.name,
            chat_image: chat.GroupChatInfo!.image,
            messages: chat.messages,
            users: chat.users,
            admins: chat.GroupChatInfo!.admins
        }
    }
}
