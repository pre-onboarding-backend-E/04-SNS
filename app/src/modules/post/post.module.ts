import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import PostController from './post.controller';
import PostService from './post.service';
import PostRepository from './post.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostRepository],
})
export default class PostModule {}
