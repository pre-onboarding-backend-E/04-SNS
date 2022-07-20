import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class HashTag {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: '해시태그',
    example: '일상',
  })
  @Column({
    nullable: false,
  })
  hashtag: string;

  @ManyToMany(() => Article, (article) => article.hashtag, { cascade: true })
  article: Article[];
}
