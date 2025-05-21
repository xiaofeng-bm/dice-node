import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { AddPlayerDto, CreateGameDto } from './dto/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { GameRecord } from './entities/game-record.entity';
import { EnterRoomDto, LeaveRoomDto } from './dto/enter-game.dto';
import { findOneByKey } from 'src/utils';
import { RemovePlayerDto } from './dto/remove-player.dto';

@Injectable()
export class GameService {
  @InjectRepository(Room)
  private roomRepository: Repository<Room>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(GameRecord)
  private gameRecordRepository: Repository<GameRecord>;

  async enterRoom(data: EnterRoomDto) {
    try {
      const user = await findOneByKey(this.userRepository, 'id', data.userId);
      if (!user) {
        throw new BadRequestException('用户不存在');
      }

      const roomInfo = await findOneByKey(
        this.roomRepository,
        'roomId',
        data.roomId,
      );
      if (!roomInfo) {
        throw new BadRequestException('房间不存在');
      }
      // 使用findOne替代findOneByKey，显式加载players关联
      const room = await this.roomRepository.findOne({
        where: { id: roomInfo.id },
        relations: ['players'],
      });
      if (!room) {
        throw new BadRequestException('房间不存在');
      }

      if (room.players?.length) {
        const hasUser = room.players.find((player) => player.id === user.id);
        if (!hasUser) {
          room.players.push(user);
        }
      } else {
        room.players = [user];
      }

      await this.roomRepository.save(room);
      return room;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async leaveRoom(data: LeaveRoomDto) {
    try {
      const user = await findOneByKey(this.userRepository, 'id', data.userId);
      if (!user) {
        return '用户不存在';
      }
      // 使用findOne替代findOneByKey，显式加载players关联
      const room = await this.roomRepository.findOne({
        where: { roomId: data.roomId },
        relations: ['players'],
      });
      if (!room) {
        throw new BadRequestException('房间不存在');
      }

      if (room.players?.length) {
        // 检查用户是否在房间中
        const playerIndex = room.players.findIndex(
          (player) => player.id === user.id,
        );

        // 如果用户在房间中，则将其移除
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          await this.roomRepository.save(room);
        } else {
          return '用户不在该房间中';
        }
      }

      await this.roomRepository.save(room);
      return room;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async removePlayer(data: RemovePlayerDto) {
    try {
      const user = await findOneByKey(this.userRepository, 'id', data.userId);
      if (!user) {
        return '用户不存在';
      }

      // 使用findOne替代findOneByKey，显式加载players关联
      const room = await this.roomRepository.findOne({
        where: { roomId: data.roomId },
        relations: ['players'],
      });
      if (!room) {
        throw new BadRequestException('房间不存在');
      }
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
