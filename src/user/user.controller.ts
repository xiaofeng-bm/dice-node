import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login') 
  login(@Body('code') code: string) {
    console.log('code', code)
    return this.userService.login(code);
  }

  @Post('update-user-info')
  async updateUserInfo(@Body() userInfo: any) {
    return await this.userService.updateUserInfo(userInfo);
  }
}
