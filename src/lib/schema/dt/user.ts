import { t } from "elysia";

export const userSchema = t.Object({
    id: t.String(),
    firstname: t.String(),
    lastname: t.String(),
    email: t.String({ format: "email" }),
    emailVerified: t.Nullable(t.Date()),
    username: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    image: t.Nullable(t.String()),
})

export const userMinSchema = t.Object({
    id: t.String(),
    username: t.String(),
    firstname: t.String(),
    lastname: t.String(),
    image: t.Union([t.String(), t.Null()])
})