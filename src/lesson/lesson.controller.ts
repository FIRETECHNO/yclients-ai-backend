import { Controller, Post, Body } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { InjectModel } from '@nestjs/mongoose';
import { LessonClass } from './schemas/lesson.schema';
import { Model } from "mongoose"
import { Lesson } from './types/lesson.interface';
import { UserClass } from 'src/user/schemas/user.schema';
import ApiError from 'src/exceptions/errors/api-error';


@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    @InjectModel("Lesson") private LessonModel: Model<LessonClass>,
    @InjectModel("User") private UserModel: Model<UserClass>,
  ) { }


  @Post('assign')
  async assign(
    @Body("lesson") lesson: Lesson
  ) {
    let teacherFromDb = await this.UserModel.findById(lesson.teacher)
    if (!teacherFromDb) throw ApiError.BadRequest("Ошибка при выборе Учителя!")

    let studentFromDb = await this.UserModel.findById(lesson.student)
    if (!studentFromDb) throw ApiError.BadRequest("Ошибка при выборе Ученика!")

    let lessonFromDb = await this.LessonModel.create(lesson)

    if (lessonFromDb._id) {
      teacherFromDb.lessons.push(lessonFromDb._id)
      studentFromDb.lessons.push(lessonFromDb._id)

      teacherFromDb.markModified("lessons")
      studentFromDb.markModified("lessons")

      await teacherFromDb.save()
      await studentFromDb.save()

      return { success: true }
    }
    return { success: false }
  }
}
