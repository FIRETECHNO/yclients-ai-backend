// src/chat/chat.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
    socket.join(room); // Подключаем пользователя к комнате (чату)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
    socket.leave(room); // Отключаем пользователя от комнаты (чата)
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { sender: string; message: string; room: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // Отправляем сообщение только в указанную комнату
    this.server.to(data.room).emit('message', data);
  }
}
