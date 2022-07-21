import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/createPost.input';
import { UpdatePostInput } from './dto/update.post.input';
import { Hashtags } from './entity/hashTag.entity';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    readonly postRepository: Repository<Post>, // readonly tagRepository: Repository<Hashtags>,
  ) {}

  async findOne(id: number): Promise<Post> {
    const result = await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
    if(!result) throw new NotFoundException('~~')
    return result
  }

  // 서울 검색 -> 서울 혹은 서울, 맛집 // 서울맛집은 X
  // 서울,맛집 검색 -> 서울, 맛집...
  async findAllPosts(take: number, skip: number): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['tags'],
      take,
      skip,
    });
  }

  async createPost(user: User, input: CreatePostInput): Promise<Post> {
    const posting: Post = new Post();

    posting.user = user;
    posting.title = input.title;
    posting.content = input.content;

    const tagList = [];
    const prefix = '#';
    input.tag.forEach(async (item) => {
      const hasTags = new Hashtags();
      hasTags.tag = prefix + item.tag;
      tagList.push(hasTags);
    });
    posting.tags = tagList;

    return await this.postRepository.save(posting);
  }

  async updatePost(
    user: User,
    id: number,
    input: UpdatePostInput,
  ): Promise<Post> {
    const updatedPost = await this.existPostCheck(user, id);

    Object.keys(input).forEach((key) => {
      updatedPost[key] = input[key];

      // key에 tag있을 때만 들어가도록 추가.
      const tagList = [];
      const prefix = '#';
      input.tag.forEach(async (item) => {
        const hasTags = new Hashtags();
        hasTags.tag = prefix + item.tag;
        tagList.push(hasTags);
      });
      updatedPost.tags = tagList;
    });

    const result = this.postRepository.save(updatedPost);
    return result;
  }

  async deletePost(user: User, id: number): Promise<void> {
    await this.existPostCheck(user, id);
    await this.postRepository.softDelete(id); // hash tag도 함께 soft delete 처리
  }

  async existPostCheck(user: User, id: number): Promise<Post> {
    const existPost: Post = await this.postRepository
      .createQueryBuilder('post')
      // .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id=:id', { id })
      .andWhere('post.user.id=:userId', { userId: user.id })
      .getOne();
    if (!existPost) throw new NotFoundException('posting info not found');
    return existPost;
  }

  //   async restorePost(user: User, id: number): Promise<Post> {
  //   }
}
