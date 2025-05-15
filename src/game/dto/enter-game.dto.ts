import { IsNotEmpty } from 'class-validator';

export class EnterRoomDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  userId: number;

  @IsNotEmpty({
    message: '房间id不能为空',
  })
  roomId: number;
}

export class LeaveRoomDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  userId: number;

  @IsNotEmpty({
    message: '房间id不能为空',
  })
  roomId: number;
}