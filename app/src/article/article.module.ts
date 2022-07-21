import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleHashtag } from './entities/article_hashtag.entity';
import { Hashtag } from './entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article, Hashtag, ArticleHashtag])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
