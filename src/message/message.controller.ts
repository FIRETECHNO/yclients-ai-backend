import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
  HttpCode,
  BadRequestException
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDocument, Message } from './schemas/message.schema';

// Default number of messages to fetch if no limit is specified by the client
const DEFAULT_MESSAGE_LIMIT = 50;
// Max number of messages allowed per request
const MAX_MESSAGE_LIMIT = 200;


@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async getMessageHistory(
    @Query('roomId') roomId: string,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_MESSAGE_LIMIT),
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true
      })
    ) limit: number,
  ): Promise<MessageDocument[]> {
    if (!roomId) {
      throw new BadRequestException('roomId query parameter is required.');
    }

    const effectiveLimit = Math.min(limit, MAX_MESSAGE_LIMIT);

    return this.messageService.findMessagesByRoomId(roomId, effectiveLimit);
  }
}