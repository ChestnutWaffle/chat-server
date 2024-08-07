import { prisma } from "."

export async function verifyUserHash(s: string, password: string, option: "email" | "username") {
    let result: { hash: string } | null = null

    if (option === "email") {
        result = await prisma.account.findFirst({
            where: {
                user: {
                    email: s
                }
            },
            select: {
                hash: true
            }
        })
    } else if (option === "username") {
        result = await prisma.account.findFirst({
            where: {
                user: {
                    username: s
                }
            },
            select: {
                hash: true
            }
        })
    }

    if (!result) {
        throw new Error("Couldn't find Account.")
    }

    const verification = await Bun.password.verify(password, result.hash)
    return verification

}
