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
  ) {}

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
    return true;
  }
}
