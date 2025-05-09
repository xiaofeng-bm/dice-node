import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';


interface JoinRoomPayload {
  roomId: number;
  username: string;
}

interface SendMessagePayload {
  sendUserOpenId: string;
  roomId: number;
  message: {
    type: 'start' | 'end' | 'points',
    content: string | number
  }
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    console.log('joinRoom', payload);
    const roomId = payload.roomId.toString();
    client.join(roomId);

    this.server.to(roomId).emit('message', {
      type: 'joinRoom',
      username: payload.username,
    })
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() payload: SendMessagePayload): void {
    const roomId = payload.roomId.toString();

    this.server.to(roomId).emit('message', { 
      type: 'sendMessage',
      openid: payload.sendUserOpenId,
      message: payload.message
    });
  }
}
