import { MongooseModule } from "@nestjs/mongoose";
import { CompanySchema } from "../schemas/company.schema";

let CompanyModel = MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema, collection: 'companies' }])
export default CompanyModel