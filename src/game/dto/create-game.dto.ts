import { IsNotEmpty } from 'class-validator';
import { UserInfoDto } from 'src/user/dto/user-info.dto';


export class CreateGameDto {
  @IsNotEmpty({
    message: 'ownerId不能为空',
  })
  ownerId: number;

  @IsNotEmpty({
    message: 'roomId不能为空',
  })
  roomId: number;
}


export class AddPlayerDto {
  @IsNotEmpty({
    message: '用户信息为空'
  })
  user: UserInfoDto;

  @IsNotEmpty({
    message: '对局id不能为空'
  })
  gameRecordId: number;
}