import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import MessageModel from "src/message/models/message.model"
import ChatModel from './models/chat.model';

@Module({
  imports: [
    // Регистрируем схему Message для использования в этом модуле
    MessageModel,
    ChatModel
  ],
  // Регистрируем Gateway и Service как провайдеры
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }