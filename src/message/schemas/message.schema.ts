import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true, // Добавляет createdAt и updatedAt
  collection: 'messages' // Явно указываем имя коллекции (хорошая практика)
})
export class Message {
  @Prop({ required: true, type: String, index: true }) // Добавляем простой индекс для roomId
  roomId: string; // ID комнаты чата

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Ссылка на пользователя (если есть коллекция User)
  senderId: Types.ObjectId; // ID отправителя

  @Prop({ required: true, type: String })
  content: string; // Текст сообщения

  // createdAt и updatedAt добавляются через { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// --- Определение Ключевых Индексов ---

// 1. Составной индекс для поиска сообщений в комнате и сортировки по времени (самый важный)
//    roomId: 1 - сортировка по roomId по возрастанию
//    createdAt: -1 - сортировка по времени по убыванию (сначала новые)
MessageSchema.index({ roomId: 1, createdAt: -1 });

// 2. Можно оставить и простой индекс по roomId, хотя составной его часто покрывает.
//    Полезен, если ищете только по roomId без сортировки по времени.
// MessageSchema.index({ roomId: 1 }); // Раскомментируйте, если нужен

// 3. Индекс по отправителю (если часто ищете все сообщения одного пользователя)
// MessageSchema.index({ senderId: 1 }); // Раскомментируйте, если нужен