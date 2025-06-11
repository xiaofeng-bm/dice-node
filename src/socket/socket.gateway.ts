import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { SocketService } from './socket.service';
import {
  WsMessage,
  JoinRoomPayload,
  LeaveRoomPayload,
} from './dto/room.entity';
import { GameService } from 'src/game/game.service';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class SocketGateway implements OnModuleInit {
  private socket: Server;
  private rooms: Map<string, WebSocket[]> = new Map();

  // 存储连接的用户信息
  private clients: Map<
    WebSocket,
    { roomId: string; username?: string; userId: number; isAlive: boolean }
  > = new Map();
  // 心跳检测间隔(毫秒)
  private readonly HEARTBEAT_INTERVAL = 10000;
  // 心跳超时时间(毫秒)
  private readonly HEARTBEAT_TIMEOUT = 60000;

  constructor(
    private readonly socketService: SocketService,
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
  ) {}

  onModuleInit() {
    this.socket = new Server({ port: 3010 });

    this.socket.on('connection', (ws: WebSocket) => {
      console.log('新客户链接');

      // 设置心跳检测
      ws.on('pong', () => {
        const clientInfo = this.clients.get(ws);
        if (clientInfo) {
          clientInfo.isAlive = true;
        }
      });

      ws.on('message', (message: string) => {
        try {
          const parseMessage = JSON.parse(message);
          console.log('收到消息: ', parseMessage);
          // 处理心跳消息
          if (parseMessage.event === 'heartbeat') {
            ws.send(
              JSON.stringify({
                event: 'heartbeat',
                data: { time: Date.now() },
              }),
            );
            return;
          }

          this.handleMessage(ws, parseMessage);
        } catch (error) {
          console.error('解析消息失败: ', error);
        }
      });

      ws.on('close', () => {
        console.log('客户断开连接');
        this.handleDisconnect(ws);
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error('WebSocket 错误:', error);
        this.handleDisconnect(ws);
      });
    });

    // 启动定时心跳检测
    setInterval(() => {
      this.socket.clients.forEach((ws: WebSocket) => {
        const clientInfo = this.clients.get(ws);
        console.log('clientInfo', clientInfo);
        if (clientInfo && !clientInfo.isAlive) {
          // 如果客户端没有响应上一次的心跳检测，断开连接
          console.log('心跳检测失败，断开连接');
          this.handleDisconnect(ws);
          return;
        }

        // 标记为未响应，等待客户端pong响应
        if (clientInfo) {
          clientInfo.isAlive = false;
        }

        // 发送ping
        try {
          ws.ping();
        } catch (e) {
          ws.terminate();
        }
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  handleMessage(client: WebSocket, message: WsMessage): void {
    switch (message.event) {
      case 'joinRoom':
        this.joinRoom(client, message.data);
        break;
      case 'gameAgain':
        this.gameAgain(client, message);
        break;
      case 'leaveRoom':
        this.leaveRoom(client, message.data);
        break;
      default:
        // 不需要额外处理的消息，直接丢回给客户端
        if (message.data && message.data.roomId) {
          this.broadcastToRoom(message.data.roomId.toString(), {
            event: 'message',
            data: {
              type: message.event,
              content: message.data,
            },
          });
        } else {
          console.error('无效的消息格式，缺少roomId:', message);
        }
        break;
    }
  }

  joinRoom(client: WebSocket, payload: JoinRoomPayload): void {
    try {
      const roomId = payload.roomId.toString();
      // 将客户端加入房间
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, []);
      }

      this.rooms.get(roomId)!.push(client);

      // 更新客户端信息
      this.clients.set(client, {
        roomId: roomId,
        userId: payload.userId,
        username: payload.username,
        isAlive: true,
      });

      // 通知房间内所有人
      this.broadcastToRoom(roomId, {
        event: 'message',
        data: {
          type: 'joinRoom',
          username: payload.username,
          userId: payload.userId,
          roomId: roomId,
        },
      });
    } catch (error) {
      console.error('加入房间失败:', error);
    }
  }

  leaveRoom(client: WebSocket, payload: LeaveRoomPayload): void {
    try {
      const roomId = payload.roomId.toString();

      // 先通知
      this.broadcastToRoom(payload.roomId.toString(), {
        event: 'message',
        data: {
          type: 'leaveRoom',
          username: payload.username,
          userId: payload.userId,
          roomId: payload.roomId,
          timestamp: Date.now(),
        },
      });
      // 从房间中移除客户端
      if (this.rooms.has(roomId)) {
        // this.rooms.delete(roomId);
        const roomClients = this.rooms.get(roomId)!;
        const result = roomClients.filter((item) => item !== client);

        this.rooms.set(roomId, result);
        this.clients.delete(client);
      }
    } catch (error) {}
  }

  async gameAgain(client: WebSocket, payload: any) {
    try {
      const roomInfo = payload.data.roomInfo;
      this.socketService.saveGameRecord(roomInfo);
      this.broadcastToRoom(roomInfo.roomId.toString(), {
        event: 'message',
        data: {
          type: payload.event,
          data: payload.data,
        },
      });
    } catch (error) {
      console.log('游戏记录保存失败:', error);
    }
  }

  // 处理用户断开连接
  private handleDisconnect(client: WebSocket): void {
    try {
      const clientInfo = this.clients.get(client);
      if (!clientInfo) return;

      // 从所有房间中移除此客户端
      if (clientInfo.roomId) {
        const roomClients = this.rooms.get(clientInfo.roomId);
        if (roomClients) {
          const index = roomClients.indexOf(client);
          if (index !== -1) {
            roomClients.splice(index, 1);

            this.gameService.leaveRoom({
              userId: clientInfo.userId,
              roomId: Number(clientInfo.roomId),
            });

            // 通知房间内的其他用户
            if (clientInfo.username) {
              this.broadcastToRoom(clientInfo.roomId, {
                event: 'message',
                data: {
                  type: 'leaveRoom',
                  username: clientInfo.username,
                  userId: clientInfo.userId,
                  roomId: clientInfo.roomId,
                  timestamp: Date.now(),
                },
              });
            }

            // 如果房间为空，删除房间
            if (roomClients.length === 0) {
              this.rooms.delete(clientInfo.roomId);
              // 删除房间
              this.roomService.deleteRoom(Number(clientInfo.roomId));
            }
          }
        }
      }

      // 从客户端映射中删除
      this.clients.delete(client);
      console.log('客户端断开连接，当前在线人数:', this.clients.size);
    } catch (error) {
      throw new Error(`处理断开连接失败: ${error}`);
    }
  }

  // 向房间内所有客户端广播消息
  private broadcastToRoom(roomId: string, message: any): void {
    const clients = this.rooms.get(roomId) || [];
    const messageStr = JSON.stringify(message);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
}
