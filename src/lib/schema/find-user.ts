import { t } from "elysia";
import { errorSchema } from "./dt/error";
import { userMinSchema } from "./dt/user";

export const findUserSchema = {
    query: t.Object({
        search: t.String()
    }),
    response: {
        200: t.Array(userMinSchema),
        400: errorSchema
    }
}