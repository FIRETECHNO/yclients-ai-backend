import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ChatService } from 'src/chat/chat.service';
import { MatchingController } from './matching.controller';

import UserModel from '../user/models/user.model';
import MatchModel from './models/match.model';
import ChatModel from 'src/chat/models/chat.model';

@Module({
  imports: [
    UserModel,
    MatchModel,
    ChatModel,
  ],
  controllers: [MatchingController],
  providers: [MatchingService, ChatService],
})
export class MatchingModule { }
