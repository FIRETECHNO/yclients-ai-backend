import { Controller, Post, Body, Get, Query } from '@nestjs/common';
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

  @Post("attach-miro-board")
  async attachMiroBoard(
    @Body("lessonId") lessonId: string,
    @Body("miroBoardUrl") miroBoardUrl: string,
  ) {
    const updatedLesson = await this.LessonModel.findByIdAndUpdate(
      lessonId,
      { $set: { miroBoardUrl: miroBoardUrl } },
      { new: true }
    );
    if (!updatedLesson) {
      throw ApiError.NotFound(`Lesson with ID ${lessonId} not found`);
    }
    return updatedLesson;
  }

  @Get("get-by-id")
  async getById(
    @Query("_id") lessonId: string
  ) {
    return await this.LessonModel.findById(lessonId);
  }

  @Get("start-lesson")
  async startLesson(
    @Query("lesson_id") lessonId: string,
    @Query("teacher_id") teacherId: string,
  ) {
    let lessonFromDb = await this.LessonModel.findById(lessonId);
    if (!lessonFromDb) throw ApiError.BadRequest("Нет такого урока!");

    if (lessonFromDb.teacher.toString() != teacherId) throw ApiError.AccessDenied("У вас не права начать этот урок!")

    lessonFromDb.isStarted = true;
    return await lessonFromDb.save()
  }

  @Get("finish")
  async finishLesson(
    @Query("lesson_id") lessonId: string,
  ) {
    let lessonFromDb = await this.LessonModel.findById(lessonId);
    if (!lessonFromDb) throw ApiError.BadRequest("Нет такого урока!");

    lessonFromDb.isFinished = true;

    try {
      await lessonFromDb.save()
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }
}
