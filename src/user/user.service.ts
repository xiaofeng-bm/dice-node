import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { findOneByKey } from 'src/utils';
import { UpdateUserInfoDto } from './dto/user-info.dto';

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

      const { openid, session_key } = data;
      // 查询是否存在用户
      let user = await findOneByKey(this.userRepository, 'openid', openid);
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
          errMsg: '用户信息不完善，请完善用户信息',
          result: newUser,
        };
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async h5Login(id: number) {
    try {
      let user = await findOneByKey(this.userRepository, 'id', id);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
      return {
        code: 0,
        result: {
          ...user,
        },
      };
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async updateUserInfo(userInfo: UpdateUserInfoDto) {
    try {
      const user = await findOneByKey(this.userRepository, 'id', userInfo.id);

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
      user.headPic = userInfo.avatarUrl;
      user.username = userInfo.nickName;
      await this.userRepository.save(user);
      return '跟新用户信息成功';
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
