import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<MessageClass>;

@Schema()
export class MessageClass {
  @Prop({
    type: String,
    required: true,
  })
  _id?: string;

  @Prop({
    type: String,
    required: true,
  })
  stringContent: string;

  @Prop({
    type: Map,
    required: true,
    default: {},
  })
  payload: Record<string, any>;

  @Prop({
    type: Number,
    required: true,
  })
  author?: number | -1;
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isIncoming: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(MessageClass);
