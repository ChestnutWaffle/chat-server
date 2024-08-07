import { t } from "elysia";
import { userSchema } from "./dt/user";

export const loginSchema = {
    body: t.Object({
        email: t.Union([t.String({ format: "email" }), t.String()]),
        password: t.String({ minLength: 6, maxLength: 32 })
    }),
    response: {
        200: t.Object({
            user: userSchema
        }),
        401: t.Object({
            name: t.String(),
            message: t.String()
        })
    }
}