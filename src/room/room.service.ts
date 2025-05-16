import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { findOneByKey } from 'src/utils';

@Injectable()
export class RoomService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  async getRoom(roomId: number) {
    try {
      const room = await findOneByKey(this.roomRepository, 'id', roomId);
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
      if (!user) {
        return '用户不存在';
      }

      let code = Number(Math.random().toString().slice(2, 8));
      // const hasRoom = await findOneByKey(this.roomRepository, 'roomId', code);
      // if(hasRoom) {
      //   code = code + 1;
      // }

      const newRoom = new Room();
      newRoom.roomId = code;
      newRoom.roomName = createRoomData.roomName;
      newRoom.roomType = createRoomData.roomType;
      newRoom.playerLimit = createRoomData.playerLimit;
      newRoom.gameType = createRoomData.gameType;
      // 默认创建房间的就是房主
      newRoom.ownerId = user.id;

      newRoom.players = [];
      const room = await this.roomRepository.save(newRoom);
      return room;
    } catch (error) {
      throw new BadRequestException(`创建房间失败: ${error}`);
    }
  }
}
