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
    readonly postRepository: Repository<Post>,
  ) {}

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  // 서울 검색 -> 서울 혹은 서울, 맛집 // 서울맛집은 X
  // 서울,맛집 검색 -> 서울, 맛집...
  async findAllPosts(take: number, skip: number): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user'],
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
    input.tag.map(async (item) => {
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
    const existPost: Post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id=:id', { id })
      .andWhere('post.user.id=:userId', { userId: user.id })
      .getOne();
    if (!existPost) throw new NotFoundException('posting info not found');

    Object.keys(input).forEach((key) => {
      existPost[key] = input[key];
    });
    return existPost;
  }

  async deletePost(user: User, id: number): Promise<void> {
    const existPost: Post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id=:id', { id })
      .andWhere('post.user.id=:userId', { userId: user.id })
      .getOne();
    if (!existPost) throw new NotFoundException('posting info not found');
    await this.postRepository.softDelete(id);
  }
}
// filter dto 적용
// exist Post 중복 로직 하나로 처리
// restore 로직 추가
// 좋아요 / 조회수
