import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '댓글 내용', example: '유익한 내용이네요!' })
  @Column({
    nullable: false,
  })
  comment: string;

  @ApiProperty({ description: '댓글 생성일' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty({ description: '댓글 수정일' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  /**
   * @description
   * - article : comment = 1:N
   * - user : comment = 1:N
   * */

  @ManyToOne(() => Article, (article) => article.comment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  public article: Article;

  @ManyToOne(() => User, (user) => user.comment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
