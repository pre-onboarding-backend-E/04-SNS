import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { Article } from './entities/article.entity';
import { ArticleHashtag } from './entities/article_hashtag.entity';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(ArticleHashtag)
    private articleHashtagRepository: Repository<ArticleHashtag>,
  ) {
    this.articleRepository = articleRepository;
    this.hashtagRepository = hashtagRepository;
    this.articleHashtagRepository = articleHashtagRepository;
  }

  /**
   * @description 게시글 상세 요청
   */
  public async getArticle(articleId: number): Promise<object> {
    try {
      const article = await this.articleRepository
        .createQueryBuilder('a')
        .select([
          'a.id',
          'a.title',
          'a.content',
          'a.hashtag',
          'a.totalLike',
          'a.totalView',
          'a.createdAt',
        ])
        .addSelect(['u.id', 'u.nickname'])
        .leftJoin('a.user', 'u')
        .where('a.id = :id', { id: articleId })
        .getOne();

      if (article.hashtag) {
        const hashtagList = await this.getHashtag(article.hashtag);
        return { ...article, hashtag: hashtagList };
      }
      return article;
    } catch (e) {
      throw new NotFoundException();
    }
  }
  /**
   * @description 게시글 목록 요청
   */
  public async getArticleList(limit: number, offset: number) {
    limit = limit || 10; // 가져올 게시글 개수
    offset = offset || 0; // 어디서부터 게시글을 가져올 지
    try {
      const articleList = await this.articleRepository
        .createQueryBuilder('a')
        .select([
          'a.id',
          'a.title',
          'a.hashtag',
          'a.totalLike',
          'a.totalView',
          'a.createdAt',
        ])
        .addSelect(['u.id', 'u.nickname'])
        .orderBy('a.createdAt', 'DESC')
        .leftJoin('a.user', 'u')
        .skip(offset * limit)
        .take(limit)
        .getMany();

      return articleList;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @description 게시글 생성 요청
   */
  public async createArticle(
    articleData: CreateArticleDTO,
    user: User,
  ): Promise<any> {
    try {
      const { content, title, hashtag } = articleData;
      const article = new Article();
      article.user = user;
      article.content = content;
      article.title = title;
      article.hashtag = hashtag;

      const newArticle = await this.articleRepository.save(article);
      const hashtagList = await this.getHashtag(hashtag);

      for (const tag of hashtagList) {
        const hashtag = await this.findOrCreateHashtag(tag);
        await this.articleHashtagRepository.insert({
          hashtag,
          article: newArticle,
        });
      }
      return { ...newArticle, hashtag: hashtagList };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @description 해시태그를 문자열에서 배열로 전환
   */
  public async getHashtag(hashtag: string) {
    const regexp = /[^#,]+/g;
    const tagList = [...hashtag.matchAll(regexp)];
    const hashtags = tagList.map((tag) => tag[0]);
    return hashtags;
  }

  /**
   * @description 해시태그 여부
   * 해시태그가 있는지 살펴보고, 없으면 해시태그를 새로 생성합니다.
   */
  public async findOrCreateHashtag(hashtag: string): Promise<object> {
    let hashtagData = await this.hashtagRepository.findOne({
      where: { hashtag: hashtag },
    });

    if (!hashtagData) {
      hashtagData = await this.hashtagRepository.save({
        hashtag,
      });
    }

    return hashtagData;
  }

  /**
   * @description 게시글 삭제 요청(soft delete)
   */
  public async deleteArticle(articleId: number, user: User): Promise<number> {
    const article = await this.getArticle(articleId);
    if (!article) {
      throw new ForbiddenException();
    }
    if (article['user'].id !== user.id) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.softDelete({
      id: articleId,
    });
    return articleId;
  }

  /**
   * @description 게시글 수정 요청
   */
  public async updateArticle(
    articleId: number,
    updateArticleData: UpdateArticleDTO,
    user: User,
  ) {
    const article = await this.getArticle(articleId);
    if (!article) {
      throw new ForbiddenException();
    }
    if (article['user'].id !== user.id) {
      throw new UnauthorizedException();
    }

    try {
      const result = await this.articleRepository
        .createQueryBuilder()
        .update(Article)
        .set(updateArticleData)
        .where('id = :id', { id: articleId })
        .execute();

      if (updateArticleData.hashtag) {
        await this.updateHashtag(updateArticleData.hashtag, articleId);
      }
      return result;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  public async updateHashtag(hashtag: string, articleId: number) {
    try {
      await this.articleHashtagRepository
        .createQueryBuilder()
        .delete()
        .from(ArticleHashtag)
        .where('articleId = :articleId', { articleId })
        .execute();

      const hashtagList = await this.getHashtag(hashtag);
      for (const tag of hashtagList) {
        const createHashtag = await this.findOrCreateHashtag(tag);

        await this.articleHashtagRepository.insert({
          hashtag: createHashtag,
          articleId: articleId,
        });
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
