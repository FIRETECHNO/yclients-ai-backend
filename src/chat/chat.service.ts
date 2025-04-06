import { Injectable } from '@nestjs/common';


// all aboout MongoDB
import { Types } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatClass } from './schemas/chat.schema';


@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private ChatModel: Model<ChatClass>,
  ) { }


  async createChat(senderId: string, receiverId: string): Promise<Types.ObjectId> {
    let chatFromDb = await this.ChatModel.create(
      {
        sender: senderId,
        receiver: receiverId
      }
    )

    return new Promise(() => chatFromDb._id);
  }
}
