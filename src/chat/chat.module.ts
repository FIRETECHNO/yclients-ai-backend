import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from "./chat.gateway"

import ChatModel from './models/chat.model';

@Module({
  controllers: [ChatController],
  imports: [ChatModel],
  providers: [ChatService, ChatGateway],
})
export class ChatModule { }
