import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<UserClass>;

@Schema({
  _id: false,
  toJSON: {
    virtuals: true, // Включаем виртуальные поля при преобразовании в JSON
    transform: (doc, ret) => {
      // Удаляем _id и __v из финального JSON
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    virtuals: true, // Включаем для преобразования в обычный объект
  },
})
export class UserClass {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  user_token: string;
}

export const UserSchema = SchemaFactory.createForClass(UserClass);

UserSchema.virtual('id').get(function () {
  return this._id;
});