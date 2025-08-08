// src/events/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<LessonClass>;

@Schema({ timestamps: true }) // Добавляем createdAt и updatedAt
export class LessonClass {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true
  })
  student: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true
  })
  teacher: Types.ObjectId

  @Prop({
    type: Date,
    required: true,
  })
  dateTime: Date;

  @Prop({
    type: Boolean,
    required: true,
  })
  isFirstLesson: boolean;

  @Prop({
    type: Array,
    required: true,
  })
  subjects: string[]

  @Prop({
    type: Array,
    required: true,
  })
  grades: number[]

  @Prop({
    type: Array,
    required: true,
  })
  goals: string[]

  @Prop({ type: String, default: null })
  miroBoardUrl: string | null;

  @Prop({ type: Boolean, default: false })
  isStarted: boolean;

  @Prop({ type: Boolean, default: false })
  isFinished: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(LessonClass);