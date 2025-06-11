import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { findOneByKey } from 'src/utils';

@Injectable()
export class RoomService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  async getRoom(roomId: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: { roomId: Number(roomId) },
        relations: ['players'],
      });
      return room;
    } catch (error) {
      throw new BadGatewayException(error);
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
      throw new BadGatewayException(error);
    }
  }

  async deleteRoom(roomId: number) {
    try {
      const room = await this.roomRepository.findOne({
        where: { roomId },
        relations: ['players'],
      });
      if (!room) {
        throw new BadRequestException('房间不存在');
      }
      // 通过 remove 触发级联删除 room_players
      await this.roomRepository.remove(room);
      return '删除房间成功';
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async hotRooms(roomType: 'public' | 'private') {
    try {
      // 计算一小时前的时间
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      const rooms = await this.roomRepository.find({
        where: {
          roomType,
          createTime: MoreThan(oneHourAgo),
        },
        order: { updateTime: 'DESC' },
        relations: ['players'],
      });
      // 筛选人数没满的房间
      const list = rooms.filter(
        (room) => room.playerLimit > room.players.length,
      );
      return list.slice(0, 5); // 返回前5个房间
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
