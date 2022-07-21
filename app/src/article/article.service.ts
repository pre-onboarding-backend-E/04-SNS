import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { Article } from './entities/article.entity';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {
    this.articleRepository = articleRepository;
    this.hashtagRepository = hashtagRepository;
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

      const hashtagList = await this.getHashtag(hashtag);
      const newArticle = await this.articleRepository.save(article);
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
}
