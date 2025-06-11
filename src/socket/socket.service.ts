import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRecord } from 'src/game/entities/game-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocketService {
  @InjectRepository(GameRecord)
  private gameRecordRepository: Repository<GameRecord>;

  async saveGameRecord(data: any) {
    try {
      const gameRecord = new GameRecord();
      gameRecord.gameResult = JSON.stringify(data);
      gameRecord.players = data.players.map((player: any) => {
        return {
          id: player.id,
          openid: player.openid,
          username: player.username,
          headPic: player.headPic,
          phoneNumber: player.phoneNumber,
          createTime: player.createTime,
          updateTime: player.updateTime,
        }
      })
      await this.gameRecordRepository.save(gameRecord)
      return '记录保存成功';
      // const gameRecord = this.gameRecordRepository.create(data);
      // await this.gameRecordRepository.save(gameRecord);
      return gameRecord;
    } catch (error) {
      return `系统异常: ${error}`;
    }
  }

  // 当房间人数为空时，删除房间
  async deleteRoom (roomId: string) {

  }
}
