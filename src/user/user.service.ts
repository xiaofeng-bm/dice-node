import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  @Inject(ConfigService)
  private configService: ConfigService;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async login(code: string) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.configService.get('app_id')}&secret=${this.configService.get('app_secret')}&js_code=${code}&grant_type=authorization_code`;

    try {
      let { data } = await axios.get(url);
      console.log('data', data);

      const { openid, session_key } = data;

      // 查询是否存在用户
      let user = await this.userRepository.findOne({
        where: {
          openid: openid,
        },
      });
      if (user) {
        // 用户存在，直接返回
        return {
          code: 0,
          result: {
            ...user,
            openid,
            session_key,
          },
        };
      } else {
        // 用户不存在，创建用户
        let newUser = new User();
        newUser.openid = openid;
        await this.userRepository.save(newUser);
        return {
          code: 0,
          result: {
            openid,
            session_key,
          },
        };
      }
    } catch (error) {
      return {
        code: -1,
        msg: '登录失败',
      };
    }
  }

  async updateUserInfo(userInfo: any) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          openid: userInfo.openid,
        },
      });
      console.log('user', user);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
      user.headPic = userInfo.avatarUrl;
      user.username = userInfo.nickName;
      await this.userRepository.save(user);
      return '跟新用户信息成功'
    } catch (error) {
      throw new HttpException('更新用户信息失败', HttpStatus.BAD_REQUEST);
    }
  }
}
