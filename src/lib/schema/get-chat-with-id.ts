import { formattedChatSchema } from "./dt/chat";
import { errorSchema } from "./dt/error";

export const getChatWithChatIdSchema = {
    response: {
        200: formattedChatSchema,
        400: errorSchema
    }
}