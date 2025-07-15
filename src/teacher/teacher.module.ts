import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import UserModel from 'src/user/models/user.model';

@Module({
  imports: [UserModel],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule { }
