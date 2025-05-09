import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({
    message: 'roomName不能为空',
  })
  roomName: string;
  @IsNotEmpty({
    message: 'roomType不能为空',
  })
  roomType: string;
  @IsNotEmpty({
    message: 'playerLimit不能为空',
  })
  @IsInt({
    message: 'playerLimit必须是数字',
  })
  playerLimit: number;

  @IsNotEmpty({
    message: 'gameType不能为空',
  })
  @IsInt({
    message: 'gameType必须是数字',
  })
  gameType: number;

  @IsNotEmpty({
    message: 'openid不能为空',
  })
  openid: string;
}
