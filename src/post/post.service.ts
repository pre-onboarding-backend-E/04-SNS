import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { In, Like, Repository } from 'typeorm';
import { CreatePostInput } from './dto/createPost.input';
import { filterPostDto } from './dto/filterPost.input';
import { UpdatePostInput } from './dto/updatePost.input';
import { Hashtags } from './entity/hashTag.entity';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    readonly postRepository: Repository<Post>,
    @InjectRepository(Hashtags)
    private tagRepository: Repository<Hashtags>,
  ) {}

  /**
   * @description 게시글 상세 조회 로직
   */
  async getOnePost(id: number): Promise<Post> {
    const result = await this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: ['tags'],
    });
    if (!result) throw new NotFoundException('해당 게시물이 없습니다.');
    return result;
  }

  /**
   * @description 게시글 조회 로직
   * - 각각 filter / search / ordering / pagination 기능을 구현함.
   * - filter 상세 설명은 filterPostDto를 참조함.
   */

  async getAllPosts(filter: filterPostDto): Promise<Post[]> {
    const allPost = await this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .take(filter.take) //lIMITS
      .skip(filter.skip); //offset

    if (filter.keyword.length > 0 && filter.tag.length == 0) {
      allPost.andWhere('posts.title LIKE (:searchKey)', {
        searchKey: `%${filter.keyword}%`,
      });
    }

    const hashTag = filter.tag || '';
    if (filter.tag.length > 0 && filter.keyword.length == 0) {
      allPost.andWhere('tags.tag IN (:...hashTag)', { hashTag: [hashTag] });
    }

    if (filter.keyword.length > 0 && filter.keyword.length > 0) {
      allPost.andWhere('posts.title LIKE (:searchKey)', {
        searchKey: `%${filter.keyword}%`,
      });
      allPost.andWhere('tags.tag IN (:hashTag)', { hashTag: hashTag });
    }

    if (filter.sortedType == 'DESC') {
      allPost.orderBy({
        'posts.createdAt': 'DESC',
      });
    }

    if (filter.sortedType == 'ASC') {
      allPost.orderBy({
        'posts.createdAt': 'ASC',
      });
    }
    return await allPost.getMany();
  }

  /**
   * @description 게시글 생성 로직
   */
  async createPost(user: User, input: CreatePostInput): Promise<Post> {
    const posting: Post = new Post();

    posting.user = user;
    posting.title = input.title;
    posting.content = input.content;

    const tagList = [];
    input.tag.forEach(async item => {
      const hasTags = new Hashtags();
      hasTags.tag = item.tag;
      tagList.push(hasTags);
    });
    posting.tags = tagList;

    return await this.postRepository.save(posting);
  }

  /**
   * @description 게시글 수정 로직
   * - 해당 포스트의 존재 여부를 체크함.
   * - 해당 포스트 글 정보를 새로운 input의 정보로 변경하여 저장함.
   * - hash tag table은 매핑 테이블이기에 기존 정보를 지우고 새로운 정보로 업데이트하는 로직으로 구현. (데이터 과 적재 방지)
   * - 변경이 필요하지 않은 값들은 key를 제외하고 보냄.
   */
  async updatePost(user: User, id: number, input: UpdatePostInput): Promise<Post> {
    await this.existPostCheck(user, id);

    const post: Post = await this.postRepository.createQueryBuilder('posts').where('posts.id = :id', { id }).getOne();

    post.title = input.title;
    post.content = input.content;

    await this.tagRepository.createQueryBuilder().delete().from(Hashtags).where('posts.id= :id', { id }).execute();

    const tagList = [];
    input.tag.forEach(async item => {
      const hasTags = new Hashtags();
      hasTags.tag = item.tag;
      tagList.push(hasTags);
    });
    post.tags = tagList;
    await this.postRepository.save(post);
    return post;
  }

  /**
   * @description 게시글 삭제 및 복구 로직
   */
  async deletePost(user: User, id: number): Promise<void> {
    await this.existPostCheck(user, id);
    await this.postRepository.softDelete(id);
  }

  async restorePost(id: number, user: User): Promise<Post> {
    const existPost = await this.postRepository
      .createQueryBuilder('post')
      .withDeleted()
      .innerJoinAndSelect('post.tags', 'tags')
      .where('post.id=:id', { id })
      .andWhere('post.user.id=:userId', { userId: user.id })
      .getOne();

    if (!existPost) {
      throw new NotFoundException('존재하지 않는 내역입니다.');
    }
    if (existPost.deletedAt === null) {
      throw new BadRequestException('삭제되지 않은 내역입니다.');
    }
    existPost.deletedAt = null;
    return await this.postRepository.save(existPost);
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
}
