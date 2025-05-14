import { Controller, Post , Body} from '@nestjs/common';
import { GameService } from './game.service';
import { AddPlayerDto, CreateGameDto } from './dto/create-game.dto';
import { EnterRoomDto } from './dto/enter-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('enter-room')
  async enterRoom(@Body() enterRoomDto: EnterRoomDto) {
    return await this.gameService.enterRoom(enterRoomDto);
  }
}
