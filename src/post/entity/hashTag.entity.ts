import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('hashTags')
export class Hashtags {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (posts) => posts.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Post;

  @Column({ nullable: true })
  tag: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
