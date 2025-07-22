import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserClass } from 'src/user/schemas/user.schema';

import type { TeacherSummary } from './interfaces/teacher-summary.interface';

@Controller('teacher')
export class TeacherController {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private readonly teacherService: TeacherService,
  ) { }

  @Post('update-teacher-summary')
  async updateTeacherSummary(
    @Body('teacherId') teacherId: string,
    @Body('summary') summary: TeacherSummary,
  ) {
    let candidate = await this.UserModel.findById(teacherId);
    let res = await this.UserModel.updateOne(
      { _id: teacherId },
      {
        $set: {
          aboutMe: summary.aboutMe,
          experience: summary.experience,
          educationLevel: summary.educationLevel,
          achievements: summary.achievements,
        },
      },
    );
    return { success: true };
  }

  @Get("get-all-teachers")
  async getAllTeachers() {
    return await this.UserModel.find({ roles: "teacher" })
  }

  @Post('get-teachers')
  async getTeachers(
    @Body("email") email: string
  ) {
    let emailRegex = new RegExp(email, "i")
    return await this.UserModel.find({ roles: "teacher", email: { $regex: emailRegex } })
  }

  @Post("update-teacher-rights")
  async updateTeacherRights(
    @Body("teacherId") teacherId: string,
    @Body("newRights") newRights: string[]
  ) {
    let result = await this.UserModel.findByIdAndUpdate(teacherId, { $set: { rights: newRights } })
    if (!result) {
      return { success: false }
    }
    return { success: true }
  }
}
