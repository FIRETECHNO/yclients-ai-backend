import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import MessageModel from "./models/message.model"

@Module({
  controllers: [MessageController],
  imports: [MessageModel],
  providers: [MessageService],
})
export class MessageModule { }
