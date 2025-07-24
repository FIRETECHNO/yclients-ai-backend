import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import LessonModel from './models/lesson.model';


@Module({
  imports: [LessonModel],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule { }
