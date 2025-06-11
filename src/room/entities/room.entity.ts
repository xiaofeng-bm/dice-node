import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'rooms',
})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    comment: '房间id',
  })
  roomId: number;

  @Column({
    length: 50,
    comment: '房间名称',
  })
  roomName: string;

  @Column({
    length: 10,
    comment: '房间类型',
  })
  roomType: string;

  @Column({
    type: 'int',
    comment: '玩家数量上限',
  })
  playerLimit: number;

  @Column({
    type: 'int',
    comment: '游戏类型',
  })
  gameType: number;

  @Column({
    type: 'int',
    comment: '房主id',
  })
  ownerId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => User, {
    nullable: true, // 可以为空
    eager: false,
    cascade: true, // 级联操作
  })
  @JoinTable({
    name: 'room_players',
  })
  players: User[];
}
