

import { IsNotEmpty } from 'class-validator';

export class RemovePlayerDto {
  @IsNotEmpty({
    message: '被移除用户id不能为空',
  })
  userId: number;

  @IsNotEmpty({
    message: '房间id不能为空',
  })
  roomId: number;
}