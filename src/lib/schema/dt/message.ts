import { t } from "elysia";
import { userMinSchema } from "./user";

export const messageSchema = t.Object({
    id: t.String(),
    content: t.String(),
    senderId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    sent: t.Boolean(),
    read: t.Array(t.Object({
        readAt: t.Date(),
        user: userMinSchema
    })),
    deletedForAll: t.Boolean(),
    chatId: t.String(),
    sender: t.Object({
        username: t.String(),
        firstname: t.String(),
        lastname: t.String(),
        image: t.Union([t.String(), t.Null()])
    })
})

// {
//     user: {
//         id: string;
//         firstname: string;
//         lastname: string;
//         username: string;
//         image: string | null;
//     };
//     readAt: Date;
// }[]