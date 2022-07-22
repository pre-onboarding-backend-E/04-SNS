import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * @description 게시글 좋아요 요청
   */
  public async likeArticle(articleId: number, user: User): Promise<object> {
    const isLike = await this.likeRepository
      .createQueryBuilder()
      .withDeleted()
      .where('userId = :userId', { userId: user.id })
      .andWhere('articleId = :articleId', { articleId })
      .getOne();

    // .findOne({
    //   where: {
    //     userId: user['id'],
    //     articleId,
    //   },
    // });
    if (!isLike.deletedAt) {
      throw new ConflictException('이미 좋아요를 눌렀습니다.');
    }
    try {
      let result;
      if (isLike.deletedAt) {
        // 삭제된 좋아요
        isLike.deletedAt = null;
        result = await this.likeRepository.save(isLike);
        return result;
      }
      const like = await this.likeRepository.create({
        userId: user.id,
        articleId,
        deletedAt: null,
      });
      result = await this.likeRepository.save(like);
      return result;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @description 좋아요가 이미 존재하는지 확인.
   */

  //   public async checkLike(articleId: number, user: User): Promise<boolean> {
  //     const isLike = await this.likeRepository.findOne({
  //       where: {
  //         userId: user['id'],
  //         articleId,
  //       },
  //     });

  //     if (!isLike) return false; // 좋아요가 눌러지지 않았다면 false,
  //     return true; // 좋아요가 눌러져있으면 true
  //   }

  /**
   * @description 좋아요 취소
   */
  public async unLikeArticle(articleId: number, user: User): Promise<object> {
    try {
      const result = await this.likeRepository.softDelete({
        articleId: articleId,
        userId: user['id'],
      });
      return result;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
function andWhere(arg0: string, arg1: { articleId: number }) {
  throw new Error('Function not implemented.');
}
