import { prisma } from ".";

async function getUserData(s: string, option: "email" | "username" | "userid") {
    let user = undefined

    if (option === "email") {
        user = await prisma.user.findUnique({
            where: {
                email: s
            }
        })


    } else if (option === "username") {
        user = await prisma.user.findUnique({
            where: {
                username: s
            }
        });
    } else if (option === "userid") {
        user = await prisma.user.findUnique({
            where: {
                id: s
            }
        })
    }

    if (!user) {
        throw "Couldn't find User"
    }

    return user;
}
export async function getUserDataByEmail(email: string) {
    return await getUserData(email, "email");
}
export async function getUserDataById(id: string) {
    return await getUserData(id, "userid")
}
export async function getUserDataByUsername(id: string) {
    return await getUserData(id, "username")
}