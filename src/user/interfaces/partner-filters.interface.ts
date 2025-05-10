import type { LangLevel } from "./lang-level.interface"

export interface PartnerFilters {
  langLevel: LangLevel[],
  minAge: number,
  maxAge: number,
  gender: string
}