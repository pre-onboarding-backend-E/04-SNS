import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Post } from '../post/post.schema';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class Unlike {
  @ApiProperty({ description: '게시물 식별 id' })
  @Prop({ type: Types.ObjectId })
  readonly _id: Types.ObjectId;

  // User : View = 1 : N
  @Prop({ type: String, ref: User.name })
  @Type(() => User)
  readonly email: string;

  // Post : View = 1 : N
  @Prop({ type: Types.ObjectId, ref: Post.name })
  @Type(() => Post)
  readonly post: Post;
}

export type UnlikeDocument = Unlike & Document;
export const UnlikeSchema = SchemaFactory.createForClass(Unlike);

// UnlikeSchema.post(/save/, (doc, next) => {
//   doc.post.unlikes += 1;
//   next();
// });
// UnlikeSchema.post(/deleteOne|remove/, (doc, next) => {
//   doc.post.unlikes -= 1;
//   next();
// });
