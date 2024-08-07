import { t } from "elysia";

export const errorSchema = t.Object({
    error: t.Object({
        name: t.String(),
        message: t.String()
    })
})