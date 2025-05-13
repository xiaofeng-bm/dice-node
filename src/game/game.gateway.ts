import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, WebSocket } from 'ws'
import { GameService } from './game.service';
import { WsMessage, JoinRoomPayload } from './dto/room.entity'

@Injectable()
export class GameGateway implements OnModuleInit {
  private socket: Server;


  constructor(private readonly gameService: GameService) {}

  onModuleInit() {
    this.socket = new Server({ port: 3010});

    this.socket.on('connection', (ws: WebSocket) => {
      console.log('新客户链接');

      this.socket.on('message', (message: string) => {
        try {
          const parseMessage = JSON.parse(message);

          this.handleMessage(ws, parseMessage)
        } catch (error) {
          console.error('解析消息失败: ', error)
        }
      })
    })
  }

  handleMessage(client: WebSocket, message: WsMessage): void {
    switch (message.event) {
      case 'joinRoom':
        this.joinRoom(client, message.data);
        break;
    
      default:
        break;
    }
  }

  joinRoom(client: WebSocket, payload: JoinRoomPayload): void {
    
  }
}
