import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './like.schema';
import LikeController from './like.controller';
import LikeService from './like.service';
import LikeRepository from './like.repository';
import PostModule from '../post/post.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]), PostModule],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeRepository],
})
export default class LikeModule {}
