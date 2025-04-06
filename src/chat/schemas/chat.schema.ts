import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
export type ChatDocument = HydratedDocument<ChatClass>;


@Schema()
export class ChatClass {
  // @Prop({
  //   type: [{ type: Types.ObjectId, ref: 'Match' }],
  //   default: [],
  // })
  // matches: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    required: true
  })
  sender: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    required: true
  })
  receiver: Types.ObjectId
}

export const ChatSchema = SchemaFactory.createForClass(ChatClass);