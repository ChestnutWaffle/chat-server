import { prisma } from "."

export async function getUserChats(userId: string) {
    const chats = await prisma.chat.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            id: true,
            messages: {
                where: {
                    deletedByUsers: {
                        none: {
                            id: userId
                        }
                    }
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            image: true,
                            username: true,
                            firstname: true,
                            lastname: true
                        }
                    },
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
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 200
            },
            type: true,
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

    if (chats === undefined) throw "User not found"

    const chats_formatted = chats.map(chat => {
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
    })

    return chats_formatted
}