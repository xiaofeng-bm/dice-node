import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  async getRoom(roomId: number) {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
        relations: ['users']
      });
      return room;
    } catch (error) {
      return '获取房间失败';
    }
  }

  async createRoom(createRoomData: CreateRoomDto) {
    try {
      const user = await this.userRepository.findOneBy({
        openid: createRoomData.openid,
      });
      console.log('users', user);
      if (!user) {
        return '用户不存在';
      }

      const roomData = {
        ...createRoomData,
        users: [user],
      };

      const room = await this.roomRepository.save(roomData);
      return room;
    } catch (error) {
      return '添加失败';
    }
  }
}
