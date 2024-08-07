import { t } from "elysia";
import { errorSchema } from "./dt/error";
import { formattedChatSchema } from "./dt/chat";

export const myChatsSchema = {
    response: {
        200: t.Array(formattedChatSchema),
        401: errorSchema
    }
}