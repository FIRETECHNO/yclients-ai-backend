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
import { LessonClass } from 'src/lesson/schemas/lesson.schema';


@Controller('user')
export class UserController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Lesson') private LessonModel: Model<LessonClass>,

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

  @Post("get-lessons")
  async getLessons(
    @Body("userId") userId: string,
    @Query("role") role: string
  ) {
    if (role == "student") {
      return await this.LessonModel.find({
        student: userId
      })
    }

    if (role == "teacher") {
      return await this.LessonModel.find({
        teacher: userId
      })
    }

    return []
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


  // async addRole(user_email: string, role_type: string) {
  //   let role: Role = {
  //     type: role_type,
  //     rest_ids: [],
  //   };
  //   return await this.UserModel.updateOne(
  //     { email: user_email, 'role.type': { $nin: [role_type] } },
  //     { $addToSet: { roles: role } },
  //     { runValidators: true },
  //   );
  // }

  // async deleteRole(user_email: string, role_type: string) {
  //   return await this.UserModel.updateOne(
  //     { email: user_email },
  //     { $unset: { 'roles.$[t]': '' } },
  //     { arrayFilters: [{ 't.type': role_type }], runValidators: true },
  //   );
  // }
}
