import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/user/decorator/currenUser';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Post)
    readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 좋아요
  async findLike(id: number) {
    const boardLikes = await this.postRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.userLikes', 'Like')
      .loadRelationCountAndMap('board.LikeCount', 'board.userLikes', 'LikeCount')
      .where('board.id = :id', { id })
      .getOne();
    if (!boardLikes) {
      //좋아요 없을시 예외처리, 더 좋은방법 강구
      const tempLikes = await this.postRepository.createQueryBuilder('board').where('board.id = :id', { id }).getOne();
      tempLikes.userLikes = [];
      return tempLikes;
    }
    return boardLikes;
  }

  async find(id: number) {
    // const boardsLike = await this.postRepository.findLike(id);
    // return boardsLike;
  }

  async add(id: number, @CurrentUser() user: User) {
    const board = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    // if 작성자가 아니면
    // const user = await this.userRepository.findOne(where);
    board.userLikes.push(user);
    return this.postRepository.save(board);
  }

  async delete(id: number, uid: number) {
    const board = await this.findLike(id);
    board.userLikes = board.userLikes.filter(likeUsers => {
      return likeUsers.id !== uid;
    });
    return this.postRepository.save(board);
  }
}
