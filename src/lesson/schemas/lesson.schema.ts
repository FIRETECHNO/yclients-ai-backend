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
  date: Date;



}

export const LessonSchema = SchemaFactory.createForClass(LessonClass);