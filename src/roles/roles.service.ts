import { Injectable } from '@nestjs/common';
import { Role } from './interfaces/role.interface'
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  getTypeFromRole(role: Role): string {
    return role.type
  }
  // getRestIdsFromRole(role: Role): mongoose.Types.ObjectId[] {
  //   return role.rest_ids
  // }
  // getRestIdsFromRoleInRoles(roles:Role[],type:string): mongoose.Types.ObjectId[]{
  //   return this.getRestIdsFromRole(roles.filter((role:Role)=>role.type==type)[0])
  // }
  // HaveKeyOfRest(role: Role, rest_id: string): boolean {
  //   return this.getRestIdsFromRole(role).includes(new mongoose.Types.ObjectId(rest_id))
  // }
  isAdmin(roles: Role[]): boolean {
    return roles.map((role: Role) => (role.type)).includes("admin")
  }
  isManager(roles: Role[]): boolean {
    return roles.map((role: Role) => (role.type)).includes("manager")
  }
}
