import { Post } from 'src/post/entity/post.entity';
import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
}
