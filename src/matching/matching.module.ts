import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import UserModel from '../user/models/user.model';

@Module({
  imports: [
    UserModel,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule { }
