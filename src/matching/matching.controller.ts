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

// all aboout MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from '../user/schemas/user.schema';

@Controller('matching')
export class MatchingController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private readonly matchingService: MatchingService
  ) { }

  @Get('')
  async getAll() {
    return await this.UserModel.find({})
  }
}
