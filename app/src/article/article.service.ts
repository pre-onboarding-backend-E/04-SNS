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

  public async getOneArticle(articleId: number): Promise<object> {
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

  public async getHashtag(hashtag: string) {
    const regexp = /[^#,]+/g;
    const tagList = [...hashtag.matchAll(regexp)];
    const hashtags = tagList.map((tag) => tag[0]);
    return hashtags;
  }

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

  public async deleteArticle(articleId: number, user: User): Promise<number> {
    const result = await this.getOneArticle(articleId);
    if (!result) {
      throw new ForbiddenException();
    }
    if (result['user'].id !== user.id) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.softDelete({
      id: articleId,
    });
    return articleId;
  }

  //   public async updateArticle(articleId: number, user: User) {}
}
