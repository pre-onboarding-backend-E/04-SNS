import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.schema';
import { Type } from 'class-transformer';

@Schema({ timestamps: true, id: false })
export class Post {
  @ApiProperty({ description: '게시물 제목', example: '게시물 1의 제목' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: '게시물 내용', example: '게시물 1의 내용' })
  @Prop({ required: true })
  contents: string;

  @ApiProperty({ description: '게시물 해시태그', example: ['맛집', '서울', '브런치 카페', '주말'] })
  @Prop({ required: true })
  hashtags: string[];

  @ApiProperty({ description: '게시물 좋아요 수', example: 1038 })
  @Prop({ default: 0 })
  likes: number;

  // 추후 구현
  // @ApiProperty({ description: '게시물 싫어요 수', example: 29 })
  // @Prop({ default: 0 })
  // unlikes: number;

  @ApiProperty({ description: '게시물 조회 수', example: 91345 })
  @Prop({ default: 0 })
  views: number;

  @ApiProperty({ description: '게시물 삭제 여부' })
  @Prop({ default: false })
  isDeleted: boolean;

  // 추후 구현
  // @ApiProperty({ description: '게시물 댓글 수', example: 913 })
  // @Prop({ default: 0 })
  // comments: number;

  // User : Post = 1 : N
  @Prop({ type: String, ref: User.name })
  @Type(() => User)
  readonly email: string;
}

export type Posts = Array<Post>;
export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post).plugin(softDeletePlugin);

// PostSchema.index({ createdAt: 1, likes: 1, views: 1 }); 같은 컴파운드 인덱스가 아닌
// 추후 정렬 조건을 여러 개로 할 수도 있으므로, 인덱스 교차를 선택
PostSchema.index({ createdAt: 1 });
PostSchema.index({ likes: 1 });
PostSchema.index({ views: 1 });
PostSchema.index({ comments: 1 });
