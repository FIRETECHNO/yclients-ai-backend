import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<CompanyClass>

@Schema({
  timestamps: true
})
export class CompanyClass {
  @Prop({ type: Number, required: true })
  companyId: number

  @Prop({ type: Number, required: true })
  applicationId: number
}

export const CompanySchema = SchemaFactory.createForClass(CompanyClass)
