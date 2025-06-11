import { Controller, Post , Body} from '@nestjs/common';
import { GameService } from './game.service';
import { AddPlayerDto, CreateGameDto } from './dto/create-game.dto';
import { EnterRoomDto, LeaveRoomDto } from './dto/enter-game.dto';
import { RemovePlayerDto } from './dto/remove-player.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('enter-room')
  async enterRoom(@Body() enterRoomDto: EnterRoomDto) {
    return await this.gameService.enterRoom(enterRoomDto);
  }

  @Post('leave-room')
  async leaveRoom(@Body() levelRoom: LeaveRoomDto) {
    return await this.gameService.leaveRoom(levelRoom);
  }

  @Post('remove-player')
  async removePlayer(@Body() removePlayer: RemovePlayerDto) {
    return await this.gameService.removePlayer(removePlayer);
  }
}
