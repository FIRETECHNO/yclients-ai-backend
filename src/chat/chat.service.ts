import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Message, MessageDocument } from '../message/schemas/message.schema'; // Путь к схеме Message

// all aboout MongoDB
import { Types } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatClass } from './schemas/chat.schema';

// DTO для создания сообщения
interface CreateMessageDto {
  roomId: string | Types.ObjectId;
  senderId: string | Types.ObjectId;
  content: string;
}

@Injectable()
export class ChatService { // Или MessageService
  private readonly logger = new Logger(ChatService.name);
  private messageBuffer: CreateMessageDto[] = []; // Буфер для пакетной записи
  private readonly BATCH_SIZE = 50;
  private readonly FLUSH_INTERVAL = 3000;
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor(
    @InjectModel('Chat') private ChatModel: Model<ChatClass>,
    @InjectModel("Message") private messageModel: Model<Message>,
  ) {
    this.startFlushInterval(); // Запускаем интервал для пакетной записи
  }

  // --- Пакетная Запись (как обсуждали ранее) ---

  private startFlushInterval(): void {
    this.intervalTimer = setInterval(() => {
      this.flushMessageBuffer().catch(err => {
        this.logger.error(`Unhandled error during message buffer flush: ${err}`, err.stack);
      });
    }, this.FLUSH_INTERVAL);
  }

  addMessageToBatch(dto: CreateMessageDto): void {
    this.messageBuffer.push(dto);
    if (this.messageBuffer.length >= this.BATCH_SIZE) {
      this.flushMessageBuffer().catch(err => {
        this.logger.error(`Unhandled error during size-triggered message buffer flush: ${err}`, err.stack);
      });
    }
  }

  private async flushMessageBuffer(): Promise<void> {
    if (this.messageBuffer.length === 0) return;

    const messagesToSave = [...this.messageBuffer];
    this.messageBuffer.length = 0; // Очищаем буфер

    this.logger.log(`Попытка сохранения пакета из ${messagesToSave.length} сообщений...`);
    try {
      // Преобразуем DTO в объекты с ObjectId перед вставкой
      const documentsToInsert = messagesToSave.map(msg => ({
        ...msg,
        senderId: new Types.ObjectId(msg.senderId) // Убедимся, что senderId это ObjectId
      }));
      await this.messageModel.insertMany(documentsToInsert, { ordered: false });
      this.logger.log(`Успешно сохранен пакет из ${messagesToSave.length} сообщений.`);
    } catch (error) {
      this.logger.error(`Ошибка сохранения пакета сообщений: ${error.message}`, error.stack);
      // !!! Обработка ошибок - вернуть в буфер? Dead-letter queue? !!!
    }
  }

  // --- Чтение Сообщений с Пагинацией и Проекцией ---

  /**
   * Получает порцию сообщений для чата с пагинацией (keyset) и проекцией.
   * @param roomId ID комнаты чата
   * @param limit Максимальное кол-во сообщений
   * @param beforeTimestamp Временная метка сообщения, *перед* которым нужно загрузить порцию (для пагинации)
   * @returns Массив документов сообщений (только с выбранными полями)
   */
  async getMessagesForRoom(
    roomId: string,
    limit: number = 50,
    beforeTimestamp?: Date | string
  ): Promise<Pick<MessageDocument, '_id' | 'roomId' | 'senderId' | 'content' | 'createdAt'>[]> {
    this.logger.debug(`Запрос сообщений для комнаты ${roomId}, лимит ${limit}, перед ${beforeTimestamp}`);

    const queryFilter: any = { roomId: roomId }; // Фильтр по комнате обязателен

    // Если указана временная метка 'before', добавляем условие для пагинации
    if (beforeTimestamp) {
      queryFilter.createdAt = { $lt: new Date(beforeTimestamp) }; // Ищем сообщения СТАРШЕ (меньше) указанной метки
    }

    // Определяем поля для проекции (выбираем только нужные)
    const projection = {
      _id: 1, // Включаем _id
      roomId: 1, // Включаем roomId
      senderId: 1, // Включаем senderId
      content: 1, // Включаем content
      createdAt: 1 // Включаем createdAt
      // Поля updatedAt и __v будут исключены автоматически
    };
    // Альтернативный синтаксис Mongoose: .select('_id roomId senderId content createdAt')

    try {
      const messages = await this.messageModel
        .find(queryFilter) // Применяем фильтр (roomId и, возможно, createdAt)
        .sort({ createdAt: -1 }) // Сортируем по убыванию времени (сначала новые)
        .limit(limit) // Ограничиваем количество
        .select(projection) // Применяем проекцию (выбираем поля)
        // .populate('senderId', 'username avatar') // Опционально: если нужна информация об отправителе
        .lean() // .lean() возвращает обычные JS объекты вместо Mongoose документов (быстрее)
        .exec(); // Выполняем запрос

      this.logger.debug(`Найдено ${messages.length} сообщений для комнаты ${roomId}`);
      // Возвращаем результат в обратном порядке, чтобы на клиенте было удобнее (старые -> новые)
      return messages.reverse();
    } catch (error) {
      this.logger.error(`Ошибка получения сообщений для комнаты ${roomId}: ${error.message}`, error.stack);
      throw error; // Перебрасываем ошибку для обработки выше
    }
  }

  // Не забываем про onApplicationShutdown для сброса буфера пакетной записи
  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Приложение завершает работу (сигнал: ${signal}). Сброс буфера сообщений...`);
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    await this.flushMessageBuffer();
    this.logger.log('Сброс буфера сообщений при выключении завершен.');
  }

  async createChat(senderId: string, receiverId: string): Promise<Types.ObjectId> {
    let chatFromDb = await this.ChatModel.create(
      {
        sender: senderId,
        receiver: receiverId
      }
    )

    return chatFromDb._id;
  }
}