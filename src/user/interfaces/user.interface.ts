import mongoose from "mongoose"
import type { Role } from "../../roles/interfaces/role.interface";
import type { LangLevel } from "./lang-level.interface";
import type { PartnerFilters } from "./partner-filters.interface";

export interface User {
  _id: mongoose.Types.ObjectId
  name: string
  surname: string
  email: string
  password: string
  roles: Role[]

  partnerFilters: PartnerFilters,

  gender: string,
  langLevel: LangLevel,
  age: number,
  idealPartnerDescription: string,
}
