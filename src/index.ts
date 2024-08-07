import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import { loginSchema } from "./lib/schema/login";
import { verifyUserHash } from "./lib/db/verify-user";
import { isValidEmail } from "./lib/utils";
import { getUserDataByEmail, getUserDataById, getUserDataByUsername } from "./lib/db/get-userdata";
import { registerSchema } from "./lib/schema/register";
import { addUser } from "./lib/db/add-user";
import { findUser } from "./lib/db/find-user";
import { findUserSchema } from "./lib/schema/find-user";
import { getProfileSchema } from "./lib/schema/get-profile";
import { getUserProfile } from "./lib/db/get-userprofile";
import { myChatsSchema } from "./lib/schema/my-chats";
import { getUserChats } from "./lib/db/get-userchats";
import { findOrCreateSingleChatWithUser } from "./lib/db/find-create-single-chat";
import { getChatWithChatIdSchema } from "./lib/schema/get-chat-with-id";
import { getChatMessages } from "./lib/db/get-chat-messages";
import { createId } from "@paralleldrive/cuid2";


const app = new Elysia({
    cookie: {
        maxAge: 7 * 24 * 60 * 60, // seconds, 7days
        secrets: ["asndlkandoqwedasmdalp iojd oqiwjdakd", "231euqwdij ad qjwd asewqd09i"],
        sign: ["token"],
        secure: true,
        sameSite: "none",
        httpOnly: true
    },
})
    .use(cors())
    .use(jwt({
        secret: Bun.env.SECRET_KEY!,
        name: "authJWT",
        schema: t.Object({
            userId: t.String()
        }),
        exp: "7d"
    }))
    .state("onlineUsers", new Map<string, number>())
    .get("/get_cuid", () => {
        return { cuid: createId() }
    },
        {
            response: {
                200: t.Object({
                    cuid: t.String()
                })
            }
        })
    .post("/login", async ({ body, cookie: { token }, authJWT, set }) => {
        const emailValid = isValidEmail(body.email)
        const result = await (emailValid ? verifyUserHash(body.email, body.password, "email") : verifyUserHash(body.email, body.password, "username"))
        if (!result) {
            set.status = 401
            return {
                name: "Unauthorized",
                message: "Email/Username or Password do not match"
            }
        }
        const user = await (emailValid ? getUserDataByEmail(body.email) : getUserDataByUsername(body.email));
        const jwt = await authJWT.sign({
            userId: user.id,
        })
        token.value = jwt

        return {
            user
        }

    }, {
        body: loginSchema.body,
        response: loginSchema.response

    })
    .post("/register", async ({ body, cookie: { token }, authJWT }) => {
        const { firstname, lastname, email, password, username } = body;

        const hash = await Bun.password.hash(password, "bcrypt")

        const user = await addUser({ firstname, lastname, email, username, hash });

        const jwt = await authJWT.sign({
            userId: user.id,
        })
        token.value = jwt

        return {
            user
        }

    }, {
        beforeHandle: ({ set, body }) => {
            if (body.password !== body.confirmPassword) {
                set.status = "Bad Request"

                throw new Error("Passwords don't match")
            }
        },
        error: ({ error }) => {
            return {
                error: error.message
            }
        },
        body: registerSchema.body,
        response: registerSchema.response
    })
    .guard({ cookie: t.Object({ token: t.String() }) }, app => (
        app.derive(async ({ cookie: { token }, set, authJWT }) => {
            if (!token || !token.value) {
                set.status = "Unauthorized"
                throw "Cookie Expired"
            }

            const jwtResult = await authJWT.verify(token.value);

            if (!jwtResult || (jwtResult.iat! + (7 * 24 * 60 * 60)) < Date.now()) {
                throw "Token Expired";
            }

            return {
                currentUserId: jwtResult.userId
            }

        })
            .get("/find_user", async ({ query }) => {
                const foundUsers = await findUser(query.search.toLowerCase())
                return foundUsers
            }, {
                query: findUserSchema.query,
                response: findUserSchema.response
            })
            .get("/profile/:id", async ({ params: { id } }) => {
                const profile = await getUserProfile(id);

                if (!profile) {
                    throw "Couldn't find User Profile";
                }

                return profile
            }, {
                response: getProfileSchema.response,
                error({ error, set }) {
                    set.status = 400;

                    return {
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    }
                }
            })
            .get("/user/:userId", async ({ params }) => {

                const user = await getUserDataById(params.userId)

                return {
                    user: user
                }
            }, {
                error({ error, set }) {
                    set.status = "Bad Request";

                    return {
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    }
                }
            })
            .get("/my_chats", async ({ currentUserId }) => {
                const chats = await getUserChats(currentUserId);
                return chats
            }, {
                error({ error, set }) {
                    set.status = 401;

                    return {
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    }
                },
                response: myChatsSchema.response,
            })
            .get("/initiate_chat/:otherId", async ({ currentUserId, params: { otherId } }) => {
                const chat = await findOrCreateSingleChatWithUser(currentUserId, otherId);
                return chat
            }, {
                response: t.Object({
                    id: t.String()
                }),
                error({ error, set }) {
                    set.status = 400;

                    return {
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    }
                }
            })
            .get("/chat/:chatId", async ({ currentUserId, params: { chatId }, query: { cursor } }) => {
                const chat_with_messages = await getChatMessages(chatId, currentUserId, cursor);

                if (!chat_with_messages) {
                    throw new Error("Couldn't find Chat ;-;")
                }

                return chat_with_messages

            }, {
                query: t.Optional(t.Object({
                    cursor: t.Union([t.String(), t.Undefined()])
                })),
                response: getChatWithChatIdSchema.response,
                error({ error, set }) {
                    set.status = 400;

                    return {
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    }
                }
            })

    ))

    .listen(4000, ({ port }) => {
        console.log(`localhost:${port}`)
    });

export type App = typeof app

