import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'game-records',
})
export class GameRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'game_record_players',
  })
  players: User[];

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'ownerId',
  })
  owner: User;

  @Column({
    type: 'json',
    nullable: true,
    comment: '游戏记录',
  })
  gameResult: object;

  @Column({
    nullable: true,
    comment: '获胜者id',
  })
  winnerId: number;
}
