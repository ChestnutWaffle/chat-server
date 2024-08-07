import { prisma } from "."

export async function addUser({
    firstname,
    lastname,
    email,
    username,
    hash
}: {
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    hash: string
}) {
    const result = await prisma.user.create({
        data: {
            email,
            firstname,
            lastname,
            username,
            accounts: {
                create: {
                    hash,
                }
            },
            Profile: {
                create: {
                    about: "Hey there! 👋"
                }
            }
        }
    })

    return result
}