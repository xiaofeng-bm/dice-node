import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户唯一id',
    unique: true,
  })
  openid: string;

  @Column({
    length: 50,
    comment: '用户名',
    nullable: true,
  })
  username: string;

  @Column({
    length: 200,
    comment: '头像',
    nullable: true,
  })
  headPic: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  phoneNumber: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
