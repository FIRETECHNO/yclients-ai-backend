import { Injectable /*, NotFoundException */ } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema'; // Adjust path if needed


// Default number of messages to fetch if no limit is specified
const DEFAULT_MESSAGE_LIMIT = 50;
// Absolute maximum number of messages allowed per request to prevent abuse
const MAX_MESSAGE_LIMIT_ALLOWED = 200;

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private messageModel: Model<Message>,
  ) { }

  /**
   * Finds messages for a specific room, optimized for the { roomId: 1, createdAt: -1 } index.
   * Returns messages sorted chronologically (oldest first).
   * Optionally populates sender information.
   * @param roomId The ID of the room.
   * @param limit Max number of *latest* messages to retrieve initially, before sorting oldest first.
   * @returns Promise<MessageDocument[]> Sorted array of messages (oldest first).
   */
  async findMessagesByRoomId(
    roomId: string,
    limit: number = DEFAULT_MESSAGE_LIMIT,
  ): Promise<MessageDocument[]> {

    // 1. Validate and cap the limit
    const effectiveLimit = Math.max(1, Math.min(limit, MAX_MESSAGE_LIMIT_ALLOWED));

    // 2. Perform the Query using the index efficiently
    // Since the index is { roomId: 1, createdAt: -1 } (newest first),
    // we can efficiently find the 'N' *latest* messages for the room.
    const latestMessages = await this.messageModel
      .find({ roomId: roomId }) // Filter by roomId (uses the first part of the index efficiently)
      .sort({ createdAt: -1 }) // Sort newest first (matches the index order, very efficient)
      .limit(effectiveLimit)    // Get the latest 'N' messages
      .populate({ // Populate sender details
        path: 'senderId',
        select: 'name username email', // Adjust fields based on your User schema
      })
      .lean() // Optional: Use .lean() for potentially better performance if you only need plain JS objects
      .exec();

    // 3. Re-sort the limited results in ascending order (oldest first) in memory
    // This is usually very fast for a limited number of messages (e.g., up to 200).
    // The initial database query was optimized by using the index's natural sort order.
    const sortedMessages = latestMessages.sort((a, b) =>
      (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)
    );

    // Return the final sorted array
    // Note: If using .lean(), the type would be Message[] instead of MessageDocument[]
    return sortedMessages as MessageDocument[]; // Cast back if using lean, otherwise remove cast
  }
}