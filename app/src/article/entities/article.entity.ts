import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { ArticleHashtag } from './article_hashtag.entity';
@Entity()
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ApiProperty({
    description: '게시글 제목',
    example: 'Nestjs로 게시판 만들기!',
  })
  @Column({
    nullable: false,
    length: 50,
  })
  public title: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '오늘은 Nest js로 게시판을 만들어보겠습니다! blah blah',
  })
  @Column({
    nullable: false,
  })
  public content: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt: Date;

  @ManyToOne(() => User, (user) => user.article, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Like, (like) => like.article, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.article, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  comment: Comment[];

  @OneToMany(() => ArticleHashtag, (articleHashtag) => articleHashtag.article, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  articleHashtag: ArticleHashtag[];
}
