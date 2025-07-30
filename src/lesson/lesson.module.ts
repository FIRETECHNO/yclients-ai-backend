import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import LessonModel from './models/lesson.model';
import UserModel from 'src/user/models/user.model';


@Module({
  imports: [LessonModel, UserModel],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule { }
