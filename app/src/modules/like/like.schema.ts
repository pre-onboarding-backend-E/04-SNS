import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Post } from '../post/post.schema';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class Like {
  @ApiProperty({ description: '게시물 식별 id' })
  @Prop({ type: Types.ObjectId })
  readonly _id: Types.ObjectId;

  // User : View = 1 : N
  @ApiProperty({ description: '좋아요 누른 유저 email' })
  @Prop({ type: String, ref: User.name })
  @Type(() => User)
  readonly email: string;

  // Post : View = 1 : N
  @ApiProperty({ description: '해당 게시물 고유 식별 id' })
  @Prop({ type: Types.ObjectId, ref: Post.name })
  @Type(() => Post)
  readonly postId: Types.ObjectId;

  @ApiProperty({ description: '좋아요 상태' })
  @Prop({ type: Boolean })
  isLiked: boolean;
}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);

// LikeSchema.post(/save/, (doc, next) => {
//   doc.post.likes += 1;
//   next();
// });
// LikeSchema.post(/deleteOne|remove/, (doc, next) => {
//   doc.post.likes -= 1;
//   next();
// });
