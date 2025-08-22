import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../schemas/message.schema';

let MessageModel = MongooseModule.forFeature([
  { name: 'Message', schema: MessageSchema, collection: 'messages' },
]);
export default MessageModel;
