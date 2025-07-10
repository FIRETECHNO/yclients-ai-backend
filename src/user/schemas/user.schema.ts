import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

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
  surname: string

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
    required: false
  })
  avatars: string[];

  // personal info
  @Prop({
    type: String,
    default: ""
  })
  gender: string


  @Prop({
    type: Number,
    default: 0
  })
  age: number
}

export const UserSchema = SchemaFactory.createForClass(UserClass);