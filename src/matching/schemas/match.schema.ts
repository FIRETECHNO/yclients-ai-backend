import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';

@Schema()
export class Match {
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true
  })
  receiver: Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true
  })
  sender: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  status: string // pending, accepted, denied
}

export const MatchSchema = SchemaFactory.createForClass(Match);