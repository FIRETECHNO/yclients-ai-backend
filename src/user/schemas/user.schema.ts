import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import type { TeacherSummary } from 'src/teacher/interfaces/teacher-summary.interface';

export type UserDocument = HydratedDocument<UserClass>;

@Schema()
export class UserClass {
  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    min: 2,
  })
  surname: string;

  @Prop({
    type: String,
    required: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  roles: string[];

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  avatars: string[];

  //Teacher info
  @Prop({
    type: String,
    default: '',
    required: false,
  })
  educationLevel: string;

  @Prop({
    type: String,
    default: '',
    required: false,
  })
  experience: string;
  @Prop({
    type: String,
    default: '',
    required: false,
  })
  achievements: string;
  @Prop({
    type: String,
    default: '',
    required: false,
  })
  aboutMe: string;
  @Prop({
    type: Array,
    required: false,
  })
  rights: string[];

  // Student info
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: false
  })
  parentId: Types.ObjectId

  // Parent info
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
    required: false
  })
  myChildren: Types.ObjectId[];

  // Teacher and Student info
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Lesson' }],
    default: [],
    required: false
  })
  lessons: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(UserClass);
