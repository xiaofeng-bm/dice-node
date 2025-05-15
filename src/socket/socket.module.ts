import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRecord } from 'src/game/entities/game-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameRecord])],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
