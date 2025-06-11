import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInfoDto } from './dto/user-info.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body('code') code: string) {
    return this.userService.login(code);
  }

  @Post('h5-login')
  async h5Login(@Body('id') id: number) {
    return await this.userService.h5Login(id);
  }

  @Post('update-user-info')
  async updateUserInfo(@Body() userInfo: UpdateUserInfoDto) {
    return await this.userService.updateUserInfo(userInfo);
  }
}
