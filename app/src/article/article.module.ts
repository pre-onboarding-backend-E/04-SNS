import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleHashtag } from './entities/article_hashtag.entity';
import { Hashtag } from './entities/hashtag.entity';
import { Like } from './entities/like.entity';
import { LikeService } from './like/like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Article, Hashtag, ArticleHashtag, Like]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, LikeService],
})
export class ArticleModule {}
