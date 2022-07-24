import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/createComment.dto';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * @description 게시글 댓글 생성
   */
  public async createComment(
    articleId: number,
    commentData: CreateCommentDto,
    user: User,
  ) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });

      if (!article)
        throw new BadRequestException('존재하지 않는 게시물입니다.');

      const comment = await this.commentRepository.create({
        comment: commentData.comment,
        user: user,
        article,
      });
      console.log('Comment', comment);
      return await this.commentRepository.save(comment);
    } catch (e) {
      if (e) throw e;
      else throw new InternalServerErrorException();
    }
  }
}
