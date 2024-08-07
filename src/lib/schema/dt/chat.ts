import { t } from "elysia";
import { messageSchema } from "./message";
import { userMinSchema } from "./user";

export const formattedChatSchema = t.Union(
    [
        t.Object({
            id: t.String(),
            type: t.Literal("Single"),
            chat_name: t.String(),
            chat_image: t.Union([t.String(), t.Null()]),
            messages: t.Array(messageSchema),
            users: t.Array(userMinSchema),
            admins: t.Optional(t.Undefined())
        }),
        t.Object({
            id: t.String(),
            type: t.Literal("Group"),
            chat_name: t.String(),
            chat_image: t.Union([t.String(), t.Null()]),
            messages: t.Array(messageSchema),
            users: t.Array(userMinSchema),
            admins: t.Array(userMinSchema)
        })
    ])
