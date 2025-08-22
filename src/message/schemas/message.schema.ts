import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<MessageClass>;

@Schema()
export class MessageClass {
  @Prop({
    type: String,
    required: true,
  })
  stringContent: string;

  @Prop({
    type: Object,
    required: false,
    default: {},
  })
  payload: any;

  @Prop({
    type: Number,
    required: true,
  })
  author: number;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isIncoming: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(MessageClass);
