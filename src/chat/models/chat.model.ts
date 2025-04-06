import { MongooseModule } from "@nestjs/mongoose";
import { ChatSchema } from "../schemas/chat.schema";

let ChatModel = MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema, collection: 'chats' }])
export default ChatModel