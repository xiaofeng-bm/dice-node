import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'rooms',
})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => User, (user) => user.room)
  users: User[];
}
