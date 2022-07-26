import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from './like.schema';

@Injectable()
export default class LikeRepository {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
  ) {}

  async updateLike(email: string, postId: string, isLiked: boolean): Promise<LikeDocument | null> {
    const like = await this.likeModel.findOneAndUpdate({ email, postId }, { isLiked }, { upsert: isLiked });

    return like;
  }
}
