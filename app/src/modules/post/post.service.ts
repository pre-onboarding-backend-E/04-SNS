import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { PostNotFound, UnAuthorizedUser } from 'src/status/error';
import { OrderByEnum, SortOptions } from 'src/utils/customTypes';
import { CreatePostDTO, UpdatePostDTO } from './dto';
import GetPostsDTO from './dto/getPosts.dto';
import PostRepository from './post.repository';
import { Post, PostDocument, Posts } from './post.schema';

@Injectable()
export default class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(createPostDTO: CreatePostDTO, email: string): Promise<Post> {
    const { title, contents, hashtags } = createPostDTO;
    const post = await this.postRepository.createPost(
      title,
      contents,
      (hashtags as string).slice(1).split(',#'),
      email,
    );

    return post;
  }

  // 이 updatePost, deletePost, restorePost 각각 권한 처리, 에러 처리 리팩토링 필요.
  // 현재 같은 코드 반복 중. 권한 처리..는 Guard 에서 하기로
  async updatePost(updatePostDTO: UpdatePostDTO, post: PostDocument) {
    // const post = await this.postRepository.updatePost(updatePostDTO, postId);
    // const post = await this.postRepository.getPostById(postId, { isDeleted: false });

    if (updatePostDTO.hasOwnProperty('hashtags')) {
      updatePostDTO.hashtags = (updatePostDTO.hashtags as string).slice(1).split(',#');
    }

    await this.postRepository.updateThisPost(updatePostDTO, post);
  }

  async deletePost(postId): Promise<boolean> {
    const isDeleted = await this.postRepository.deletePost(postId);

    return isDeleted;
  }

  async restorePost(postId): Promise<boolean> {
    const isRestored = await this.postRepository.restorePost(postId);

    return isRestored;
  }

  async getPost(postId): Promise<Post> {
    const post = await this.postRepository.getPostById(postId, { isDeleted: false });
    await this.postRepository.updateThisPost({}, post, { $inc: { views: 1 } });

    return post;
  }

  async getPosts(getPostsDTO: GetPostsDTO): Promise<Posts> {
    const { sortBy, orderBy, search, hashtags, page, limit } = getPostsDTO;

    // 추후 복수 정렬 조건 구현
    const filter: FilterQuery<Post> = {
      isDeleted: false,
    };
    const filteredSortBy = sortBy.filter(Boolean);
    const filteredOrderBy = orderBy.filter(Boolean);
    const filteredHashtags = hashtags.filter(Boolean);

    if (filteredSortBy.length === 0) {
      filteredSortBy[0] = 'createdAt';
    }

    if (filteredOrderBy.length === 0) {
      filteredOrderBy[0] = 'asc';
    }

    // 복수 정렬 시 사용
    // 아직 forEach 순서대로 정렬되는지 확인 불가
    // filteredSortBy.forEach((sortStandard, i) => (sortOptions[sortStandard] = OrderByEnum[filteredOrderBy[i]]));

    const sortOptions: SortOptions = {
      [filteredSortBy[0]]: OrderByEnum[filteredOrderBy[0]],
    };

    if (!!search) {
      const searchQuery = new RegExp(search, 'ui');
      filter.$or = [{ title: searchQuery }, { contents: searchQuery }];
    }

    if (filteredHashtags.length > 0) {
      filter.hashtags = { $all: filteredHashtags };
    }

    // 이렇게 구현했을때 부작용
    // 예를 들어 데이터를 page 가 5, limit 이 1000 일 경우,
    // 데이터를 5000개 불러와서 앞의 4000개를 건너 뛰어야 한다.
    // 점점 page 가 커지면 커질수록, 불러와야 할 데이터가 늘어나기 때문에 가면 갈수록 훨씬 느려진다.
    // 그러므로 DP?(내가 생각하기엔 DP스럽다 생각함) 를 적용한 버킷 패턴을 구현해볼 예정이다.
    // 일단 지금은 구현부터...
    // 추후 버킷 패턴 구현
    // https://darrengwon.tistory.com/826
    // https://www.mongodb.com/blog/post/paging-with-the-bucket-pattern--part-1
    const posts = await this.postRepository.getPosts(filter, sortOptions, page || 1, limit || 10);

    return posts;
  }
}
