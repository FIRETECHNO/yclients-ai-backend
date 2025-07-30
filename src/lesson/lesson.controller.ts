import { Controller, Post, Body } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { InjectModel } from '@nestjs/mongoose';
import { LessonClass } from './schemas/lesson.schema';
import { Model } from "mongoose"
import { Lesson } from './types/lesson.interface';


@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    @InjectModel("Lesson") private LessonModel: Model<LessonClass>
  ) { }


  @Post('assign')
  async assign(
    @Body("lesson") lesson: Lesson
  ) {
    let res = await this.LessonModel.create(lesson)
    if (res._id) {
      return { success: true }
    }
    return { success: false }
  }
}
