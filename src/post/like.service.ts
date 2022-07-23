import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/user/decorator/currenUser';
import { User } from 'src/user/user.entity';
import { ErrorType } from 'src/utils/response/error.type';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostService } from './post.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postService: PostService,
  ) {}

  /**
   * @description
   *  - (1) 작성자 == 좋아요를 보내려는 사용자라면 좋아요를 누를 수 없음.
   *  - (2) 이미 좋아요를 누른 유저의 경우, 다시 해당 게시물에 좋아요를 누를 수 없음.
   */
  async likePost(id: number, @CurrentUser() user: User) {
    const existPost = await this.postService.getOnePost(id);

    // (1)
    if (existPost.userId == user.id) throw new BadRequestException(ErrorType.postAuthorIsSame);

    // (2)
    const alreadyLiked = existPost.userLikes.filter(likeUsers => {
      likeUsers.id == user.id;
    });
    if (alreadyLiked) {
      throw new BadRequestException(ErrorType.userAlreadyLiked);
    }

    existPost.userLikes.push(user);
    return this.postRepository.save(existPost);
  }

  /**
   * @description
   *  - 게시글의 좋아요를 취소함.
   */
  async deleteLikePost(id: number, user: User) {
    const existPost = await this.postService.getOnePost(id);

    existPost.userLikes = existPost.userLikes.filter(likeUsers => {
      return likeUsers.id !== user.id;
    });
    return this.postRepository.save(existPost);
  }
}
