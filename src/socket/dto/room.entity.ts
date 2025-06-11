// WebSocket消息接口
export interface WsMessage {
  event: string;       // 事件类型
  data: any;           // 事件数据
}

export interface JoinRoomPayload {
  roomId: number;
  username: string;
  userId: number;
}

export interface RoomInfo {
  client: WebSocket;
  roomId: number;
  players: any[];
}

export interface LeaveRoomPayload extends JoinRoomPayload {}