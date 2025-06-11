import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRecord } from 'src/game/entities/game-record.entity';
import { GameModule } from 'src/game/game.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameRecord]), GameModule, RoomModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
