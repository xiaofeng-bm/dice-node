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

  @Column({
    type: 'json',
    nullable: true,
    comment: '游戏记录',
  })
  gameResult: string;

}
