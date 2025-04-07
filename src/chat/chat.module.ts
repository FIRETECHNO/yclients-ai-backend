import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import MessageModel from "src/message/models/message.model"
import ChatModel from './models/chat.model';
import UserModel from 'src/user/models/user.model';

import { ChatController } from './chat.controller';

@Module({
  imports: [
    // Регистрируем схему Message для использования в этом модуле
    MessageModel,
    ChatModel,
    UserModel,
  ],
  controllers: [ChatController],
  // Регистрируем Gateway и Service как провайдеры
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }