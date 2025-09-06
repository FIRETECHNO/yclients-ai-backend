import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyClass } from './schemas/company.schema';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
    @InjectModel('Company') private CompanyModel: Model<CompanyClass>,
  ) { }

  @Post("connect-new")
  async connectCompany(
    @Body("company_id") companyId: number,
    @Body("application_id") applicationId: number,
    @Body("event") event: string,
  ) {
    if (event != "install") {

    }

    let result = await this.CompanyModel.create({ companyId, applicationId })

    return { data: result, success: true, meta: null }
  }

  @Get("get-by-id")
  async getById(
    @Query("company_id") companyId: number
  ) {
    let candidate = await this.CompanyModel.findOne({ companyId })

    if (!candidate) return { data: null, success: false, meta: null }

    return {
      data: candidate, success: true,
      meta: null
    }
  }
}
