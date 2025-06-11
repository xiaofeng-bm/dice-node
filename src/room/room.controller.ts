import { Module, Post, Body, Controller, Get, Query, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('get-room')
  async getRoom(@Query('roomId') roomId: string) {
    return await this.roomService.getRoom(roomId);
  }
  @Post('create-room')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.createRoom(createRoomDto);
  }

  @Post('delte-room')
  async deleteRoom(@Body() roomId: number) {
    return await this.roomService.deleteRoom(roomId);
  }

  @Get('hot-rooms')
  async hotRooms(@Param('roomType') roomType: 'public' | 'private') {
    return await this.roomService.hotRooms(roomType);
  }
}
