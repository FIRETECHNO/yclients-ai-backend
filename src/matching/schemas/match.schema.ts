import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';

@Schema()
export class Match {
  @Prop({
    type: Types.ObjectId,
    required: true
  })
  receiver: UserClass

  @Prop({
    type: Types.ObjectId,
    required: true
  })
  sender: UserClass

  @Prop({
    type: String,
    required: true
  })
  status: string // pending, accepted, denied
}

export const MatchSchema = SchemaFactory.createForClass(Match);