import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortOptions } from 'src/utils/customTypes';
import { UpdatePostDTO } from './dto';
import { Post, PostDocument, Posts } from './post.schema';

@Injectable()
export default class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: SoftDeleteModel<PostDocument>,
  ) {}

  async createPost(title: string, contents: string, hashtags: string[], email: string): Promise<Post> {
    const post = await this.postModel.create({ title, contents, hashtags, email });

    return post;
  }

  async updatePost(
    updatePostDTO: UpdatePostDTO,
    postId,
    filter?: FilterQuery<PostDocument>,
    updateQuery?: UpdateQuery<PostDocument>,
  ): Promise<Post> {
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, ...filter },
      { ...updatePostDTO, ...updateQuery },
    );

    return post;
  }

  async updateThisPost(updatePostDTO: UpdatePostDTO, post: PostDocument, updateQuery?: UpdateQuery<PostDocument>) {
    return await post.updateOne({ ...updatePostDTO, ...updateQuery }, { new: true });
  }

  async deletePost(postId) {
    const { deleted } = await this.postModel.softDelete({ _id: postId });

    return deleted === 1;
  }

  async restorePost(postId) {
    const { restored } = await this.postModel.restore({ _id: postId });

    return restored === 1;
  }

  async getPostById(postId, filter?: FilterQuery<PostDocument>) {
    const post = await this.postModel.findOne({ _id: postId, ...filter });

    return post;
  }

  async getPosts(filter: FilterQuery<Post>, sortOptions: SortOptions, page: number, limit: number): Promise<Posts> {
    const posts = await this.postModel
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    return posts;
  }
}
