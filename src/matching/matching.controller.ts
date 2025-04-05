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

import ApiError from 'src/exceptions/errors/api-error'

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from '../user/schemas/user.schema';
import { Match } from './schemas/match.schema';

@Controller('matching')
export class MatchingController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Match') private MatchModel: Model<Match>,
    private readonly matchingService: MatchingService
  ) { }

  @Get('/')
  async getAll() {
    return await this.UserModel.find({})
  }

  @Post('like')
  async likeUser(
    @Body('likedUserId') likedUserId: string, // user to send a request
    @Body('userId') userId: string, // current user
  ) {
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

    return true;
  }

  @Get('populate-matches')
  async populateMatches(
    @Query("user_id") userId: string
  ) {
    return await this.UserModel.findById(userId).populate({
      path: "matches",
      populate: {
        path: "receiver",
        select: "name surname email"
      }
    })
  }
}
