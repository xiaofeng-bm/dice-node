import { IsDate, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  id: number;

  @IsNotEmpty({
    message: '用户id不能为空',
  })
  openid: string;

  @IsNotEmpty({
    message: '用户id不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '用户id不能为空',
  })
  headPic: string;

  phoneNumber: number;

  @IsDate({
    message: '创建时间格式不正确',
  })
  createTime: Date;

  @IsDate({
    message: '更新时间格式不正确',
  })
  updateTime: Date;
}


export class UpdateUserInfoDto{
  @IsNotEmpty({
    message: 'id不能为空',
  })
  @IsNumber({}, {
    message: 'id必须为数字',
  })
  id: number;

  @IsNotEmpty({
    message: 'avatarUrl不能为空',
  })
  avatarUrl: string;

  @IsNotEmpty({
    message: 'nickName不能为空',
  })
  nickName: string;
}