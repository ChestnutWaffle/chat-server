import { t } from "elysia";
import { userSchema } from "./dt/user";

export const registerSchema = {
    body: t.Object({
        firstname: t.String({ minLength: 2 }),
        lastname: t.String({ minLength: 2 }),
        username: t.String({ minLength: 4, maxLength: 16 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6, maxLength: 32 }),
        confirmPassword: t.String({ minLength: 6, maxLength: 32 })
    }),
    response: t.Object({
        user: userSchema
    })
}