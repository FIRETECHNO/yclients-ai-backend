import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { MatchingService } from './matching.service';
import { ChatService } from 'src/chat/chat.service';

import ApiError from 'src/exceptions/errors/api-error'

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserClass } from '../user/schemas/user.schema';
import { Match } from './schemas/match.schema';

@Controller('matching')
export class MatchingController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Match') private MatchModel: Model<Match>,
    private readonly matchingService: MatchingService,
    private ChatService: ChatService,
  ) { }

  @Post('/get-matches')
  async getAll(
    @Body("currentUserId") currentUserId: string,
  ) {
    return await this.UserModel.find({ _id: { $ne: currentUserId } })
  }

  @Post('like')
  async likeUser(
    @Body('likedUserId') likedUserId: string, // user to send a request
    @Body('userId') userId: string, // current user
  ) {
    let foundMatch = await this.MatchModel.findOne({
      $or: [
        { sender: userId, receiver: likedUserId },
        { sender: likedUserId, receiver: userId }
      ]
    });

    if (foundMatch) {
      throw ApiError.BadRequest(`Заявка уже есть!`)
    }

    let newMatch = await this.MatchModel.create({ sender: userId, receiver: likedUserId, status: "pending" });

    let result = await this.UserModel.findByIdAndUpdate(userId, { $push: { matches: newMatch._id } });
    if (result == null) {
      await this.MatchModel.findByIdAndDelete(newMatch._id);
      throw ApiError.NotFound(`Пользователь с _id ${userId} не найден`)
    }

    result = await this.UserModel.findByIdAndUpdate(likedUserId, { $push: { matches: newMatch._id } });
    if (result == null) {
      await this.UserModel.findByIdAndUpdate(userId, { $pull: { matches: newMatch._id } })
      await this.MatchModel.findByIdAndDelete(newMatch._id);

      throw ApiError.NotFound(`Пользователь с _id ${likedUserId} не найден`)
    }

    return { success: true };
  }

  @Get('populate-matches')
  async populateMatches(
    @Query("user_id") userId: string
  ) {
    const fieldsToPopulate = "name surname email";

    return await this.UserModel.findById(userId).populate({
      path: "matches",
      populate: {
        path: "receiver",
        select: fieldsToPopulate,
      },
    }).populate({
      path: "matches",
      populate: {
        path: "sender",
        select: fieldsToPopulate,
      },
    })
  }

  @Post("accept-match")
  async acceptMatch(
    @Body('matchId') matchId: string,
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ) {
    let sender = await this.UserModel.findById(senderId);
    let receiver = await this.UserModel.findById(receiverId);


    if (!sender) throw ApiError.NotFound(`Пользователь с _id ${senderId} не найден`);
    if (!receiver) throw ApiError.NotFound(`Пользователь с _id ${receiverId} не найден`);

    // clear collection
    await this.MatchModel.findByIdAndDelete(matchId);

    let chatId = await this.ChatService.createChat(senderId, receiverId);

    sender.chats.push(chatId);
    receiver.chats.push(chatId);

    sender.markModified("chats")
    receiver.markModified("chats")

    return [await sender.save(), await receiver.save()]
  }
}
