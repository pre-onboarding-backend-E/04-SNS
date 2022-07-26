import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Type } from 'class-transformer';
import { Post } from '../post/post.schema';

@Schema({ timestamps: true })
export class View {
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

export type ViewDocument = View & Document;
export const ViewSchema = SchemaFactory.createForClass(View);

// ViewSchema.post(/save/, (doc, next) => {
//   doc.post.views += 1;
//   next();
// });
// ViewSchema.post(/deleteOne|remove/, (doc, next) => {
//   doc.post.views -= 1;
//   next();
// });
