import mongoose from 'mongoose';
import type { Role } from '../../roles/interfaces/role.interface';
import type { Lesson } from 'src/lesson/types/lesson.interface';

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

  lessons: Lesson[] | string[]
}
