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
    console.log(teacherId, summary);
    let candidate = await this.UserModel.findById(teacherId);
    this.UserModel.updateOne(
      { _id: teacherId },
      {
        $set: {
          educationLevel: summary.educationLevel,
          experience: summary.experience,
          achievements: summary.achievements,
          aboutMe: summary.aboutMe,
        },
      },
    );
    // найти по teacherId и обновить все поля, которые пришли из summary
  }
}
