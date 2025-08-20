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

import { SomeAdminGuard } from 'src/admin/some_admin.guard';
import { RolesService } from 'src/roles/roles.service';
import { GlobalAdminGuard } from 'src/admin/global_admin.guard';

import { UserService } from './user.service';
import ApiError from 'src/exceptions/errors/api-error';


// types
import { Role } from '../roles/interfaces/role.interface';
import { UserFromClient } from './interfaces/user-from-client.interface';
import RequestWithUser from 'src/types/request-with-user.type';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from './schemas/user.schema';


@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,

    private UserService: UserService,
    private RolesService: RolesService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(SomeAdminGuard)
  @Post('change-user')
  async changeUser(
    @Req() req: RequestWithUser,
    @Body('user') user: UserFromClient,
  ) {
    let subject_user = await this.UserModel.findById(user._id);

    // ... Защиты, проверки

    await subject_user?.updateOne(user, { runValidators: true });
  }

  /**
   * 
   * @param 
   * @returns updatedUser: User
   * */
  @Post('update-about')
  async updateAbout(
    @Body("userId") userId: string,
  ) {
    let userFromDb = await this.UserModel.findById(userId);

    if (!userFromDb) {
      throw ApiError.BadRequest('Пользователь с таким ID не найден');
    }

    await userFromDb.save();

    return { updatedUser: userFromDb };
  }

  @Get("get-by-id")
  async getById(
    @Query("_id") userId: string
  ) {
    let candidate = await this.UserModel.findById(userId)
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким ID не найден');

    return candidate;
  }
}
