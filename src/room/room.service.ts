import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { findOneByKey } from "src/utils"

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

      const newRoom = new Room();
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
      return '添加失败';
    }
  }
}
