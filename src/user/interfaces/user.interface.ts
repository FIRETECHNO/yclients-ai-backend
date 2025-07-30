import mongoose from 'mongoose';
import type { Role } from '../../roles/interfaces/role.interface';

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  roles: Role[];

  // Teacher info
  educationLevel?: string;
  experience?: string;
  achievements?: string;
  aboutMe?: string;
  rights: string[];

  // Student info
  parentId?: string

  // Parent info
  myChildren?: string[]

  lessons: string[]
}
