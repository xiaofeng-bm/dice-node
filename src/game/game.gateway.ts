import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameService } from './game.service';
import * as WebSocket from 'ws';
import { IncomingMessage, Server } from 'http';

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

interface WSMessage {
  event: string;
  data: any;
}

@Injectable()
export class GameGateway implements OnModuleInit {
  private wss: WebSocket.Server;
  private rooms: Map<string, WebSocket[]> = new Map();

  constructor(private readonly gameService: GameService) {}

  onModuleInit() {
    this.wss = new WebSocket.Server({ port: 3010 });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      // 处理消息
      ws.on('message', (message: string) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      });

      // 处理关闭连接
      ws.on('close', () => {
        this.removeClientFromAllRooms(ws);
      });
    });
  }

  // 处理收到的消息
  private handleMessage(client: WebSocket, message: WSMessage): void {
    switch (message.event) {
      case 'joinRoom':
        this.handleJoinRoom(client, message.data);
        break;
      case 'sendMessage':
        this.handleSendMessage(message.data);
        break;
      default:
        console.warn(`未知的事件类型: ${message.event}`);
    }
  }

  // 处理加入房间
  private handleJoinRoom(client: WebSocket, payload: JoinRoomPayload): void {
    console.log('joinRoom', payload);
    const roomId = payload.roomId.toString();
    
    // 将客户端加入房间
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
    }
    
    this.rooms.get(roomId)!.push(client);
    
    // 通知房间内所有人
    this.broadcastToRoom(roomId, {
      event: 'message',
      data: {
        type: 'joinRoom',
        username: payload.username,
      }
    });
  }

  // 处理发送消息
  private handleSendMessage(payload: SendMessagePayload): void {
    const roomId = payload.roomId.toString();
    
    this.broadcastToRoom(roomId, {
      event: 'message',
      data: {
        type: 'sendMessage',
        openid: payload.sendUserOpenId,
        message: payload.message
      }
    });
  }
  
  // 从所有房间中移除客户端
  private removeClientFromAllRooms(client: WebSocket): void {
    for (const [roomId, clients] of this.rooms.entries()) {
      const index = clients.indexOf(client);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    }
  }
  
  // 向房间内所有客户端广播消息
  private broadcastToRoom(roomId: string, message: any): void {
    const clients = this.rooms.get(roomId) || [];
    const messageStr = JSON.stringify(message);
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
}
