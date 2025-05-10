import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { PartnerFilters } from '../interfaces/partner-filters.interface';
import { LangLevel } from '../interfaces/lang-level.interface';

export type UserDocument = HydratedDocument<UserClass>;

import { Match } from '../../matching/schemas/match.schema';

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

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Match' }],
    default: [],
  })
  matches: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Chat' }],
    default: [],
  })
  chats: Types.ObjectId[];

  @Prop({
    type: Object,
    default: {}
  })
  partnerFilters: PartnerFilters

  // personal info
  @Prop({
    type: String,
    default: ""
  })
  gender: string

  @Prop({
    type: Object,
    default: {}
  })
  langLevel: LangLevel

  @Prop({
    type: Number,
    default: 0
  })
  age: number

  @Prop({
    type: String,
    default: ""
  })
  idealPartnerDescription: string
  // personal info
}

export const UserSchema = SchemaFactory.createForClass(UserClass);