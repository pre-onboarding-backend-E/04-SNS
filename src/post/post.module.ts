import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtags } from './entity/hashTag.entity';
import { Post } from './entity/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Hashtags])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
