import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Post } from '../post/post.schema';
import { User } from '../user/user.schema';

export class BaseComment {
  @ApiProperty({ description: '댓글 혹은 대댓글의 내용', example: '댓글 1의 내용' })
  @Prop({ required: true })
  contents: string;
}

@Schema({ timestamps: true })
export class Recomment extends BaseComment {
  // User : Recomment = 1 : N
  @ApiProperty({ description: '대댓글을 단 유저 email' })
  @Prop({ type: String, ref: User.name })
  @Type(() => User)
  readonly email: string;

  @ApiProperty({ description: '대댓글을 단 대댓글의 id(유튜브의 @ 기능)', example: '대댓글_id' })
  @Prop({ type: Types.ObjectId, default: '' })
  recommentAt: Types.ObjectId;
}

export type RecommentDocument = Recomment & Document;
export const RecommentSchema = SchemaFactory.createForClass(Recomment);

RecommentSchema.index({ createdAt: 1 });
RecommentSchema.post(/save/, (_, next) => {
  console.log('대댓글 생성');
  next();
});
RecommentSchema.post(/deleteOne|remove/, (_, next) => {
  console.log('대댓글 삭제');
  next();
});

@Schema({ timestamps: true })
export class Comment extends BaseComment {
  // User : Comment = 1 : N
  @ApiProperty({ description: '댓글을 단 유저 id' })
  @Prop({ type: Types.ObjectId, ref: User.name })
  @Type(() => User)
  readonly user: User;

  // Post : Comment = 1 : N
  @Prop({ type: Types.ObjectId, ref: Post.name })
  @Type(() => Post)
  readonly post: Post;

  @ApiProperty({ description: '대댓글 목록', example: ['대댓글 1', '대댓글 2', '대댓글 3'] })
  @Prop({ type: [RecommentSchema] })
  recomments: Recomment[];
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ createdAt: 1 });
CommentSchema.post(/save/, (doc, next) => {
  console.log('댓글 생성');
  // doc.post.comments += 1;
  next();
});
CommentSchema.post(/deleteOne|remove/, (doc, next) => {
  console.log('댓글 삭제');
  // doc.post.comments -= 1;
  next();
});
