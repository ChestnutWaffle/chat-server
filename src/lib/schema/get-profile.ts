import { t } from "elysia";
import { errorSchema } from "./dt/error";
import { userMinSchema } from "./dt/user";

export const getProfileSchema = {
    response: {
        200: t.Object({
            about: t.Union([t.String(), t.Null()]),
            user: userMinSchema
        }),
        400: errorSchema
    }
}