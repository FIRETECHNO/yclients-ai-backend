import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';

import UserModel from '../user/models/user.model';
import MatchModel from './models/match.model';

@Module({
  imports: [
    UserModel,
    MatchModel,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule { }
