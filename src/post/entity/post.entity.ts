import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Hashtags } from './hashTag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  //좋아요
  @Column({ default: null, nullable: true })
  likes: number;

  //조회수
  @Column({ default: null, nullable: true })
  views: number;

  //해시 태그
  @OneToMany(() => Hashtags, (tags) => tags.posts, {
    cascade: true,
  })
  tags: Hashtags[];

  // 작성일
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @RelationId((post: Post) => post.user)
  userId: User['id'];
}
