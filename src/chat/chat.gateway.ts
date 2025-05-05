import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

// Настраиваем CORS и другие параметры по необходимости
@WebSocketGateway({ cors: { origin: '*' /* Или ваш Nuxt URL */ } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // Экземпляр сервера Socket.IO
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) { }

  handleConnection(client: Socket) {
    this.logger.log(`Клиент подключен: ${client.id}`);
    // Здесь можно добавить логику аутентификации и присоединения к комнатам
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Клиент отключен: ${client.id}`);
    // Логика выхода из комнат
  }

  // Обработка события 'sendMessage' от клиента
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() messageData: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> { // Часто не возвращаем явный ответ на сообщение чата
    this.logger.debug(`Получено сообщение от ${client.id} для комнаты ${messageData.roomId}`);

    // !!! Важно: Получите ID пользователя после аутентификации !!!

    // 1. Добавляем сообщение в буфер через сервис
    this.chatService.addMessageToBatch(messageData);

    // 2. **НЕМЕДЛЕННО** отправляем сообщение другим клиентам в комнате
    //    (Они увидят сообщение ДО его сохранения в БД!)
    const broadcastPayload = {
      ...messageData,
      // Можно добавить дополнительные поля, например, имя отправителя
    };
    this.server.to(messageData.roomId).emit('newMessage', broadcastPayload);

    // Подтверждение отправки клиенту (опционально)
    // client.emit('messageSentAck', { tempId: payload.tempId }); // Если у сообщений есть временный ID с клиента
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!roomId) return;
    client.join(roomId);
    client.emit('joinedRoom', `Вы успешно вошли в комнату ${roomId}`);
  }
}