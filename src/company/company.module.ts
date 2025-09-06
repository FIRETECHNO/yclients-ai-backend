import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import CompanyModel from './models/company.model';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [CompanyModel]
})
export class CompanyModule { }
