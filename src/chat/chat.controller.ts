import { Controller, Post, Body, } from '@nestjs/common';
import { ChatService } from './chat.service';

import ApiError from 'src/exceptions/errors/api-error';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from '../user/schemas/user.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @InjectModel('User') private UserModel: Model<UserClass>,
  ) { }

  @Post('get-user-chats')
  async getUserMatches(
    @Body("userId") userId: string
  ) {
    const fieldsToSelect = "name surname email";

    let userFromDb = await this.UserModel.findById(userId)
      .populate({
        path: "chats",
        populate: [
          {
            path: "receiver",
            select: fieldsToSelect,
            match: { _id: { $ne: userId } } // Only populate if receiver is not current user
          },
          {
            path: "sender",
            select: fieldsToSelect,
            match: { _id: { $ne: userId } } // Only populate if sender is not current user
          }
        ]
      })

    if (!userFromDb) throw ApiError.NotFound(`Пользователь с _id ${userId} не найден`);

    return userFromDb?.chats;
  }
}
