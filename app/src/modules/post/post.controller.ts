import {
  Controller,
  UseGuards,
  Post,
  Res,
  Req,
  Patch,
  Get,
  Param,
  Query,
  Delete,
  Body,
  ParseArrayPipe,
  DefaultValuePipe,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AccessJWTGuard, RolesGuard } from '../auth/guards';
import PostService from './post.service';
import { CreatePostDTO, UpdatePostDTO, GetPostsDTO } from './dto';
import { createResponseData, responseHandler } from 'src/utils/response';
import { OrderBysType, SortBysType } from 'src/utils/customTypes';
import { CONSTANT_ACCESS } from 'src/constants';
import { PostNotFound, UnAuthorizedToken, UnAuthorizedUser, UserNotFound } from 'src/status/error';
import {
  CreatePostResponse,
  DeletePostResponse,
  GetPostResponse,
  GetPostsResponse,
  RestorePostResponse,
  UpdatePostResponse,
} from 'src/status/success';
import { Post as PostType, Posts } from './post.schema';

@ApiTags('posts')
@Controller('posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @UseGuards(AccessJWTGuard)
  // swagger
  @ApiBody({ type: CreatePostDTO })
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiCreatedResponse({ type: CreatePostResponse.type, description: CreatePostResponse.message })
  @ApiOperation({ description: '게시물 생성 API 입니다.', summary: '게시물 생성' })
  async createPost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const {
      user: {
        user: { email },
      },
    } = req;
    const post = await this.postService.createPost(createPostDTO, email);

    res.status(CreatePostResponse.code).json(createResponseData<PostType>(CreatePostResponse, post));

    // responseHandler(res, {
    //   json: createResponseData<PostType>(CreatePostResponse, post),
    //   statusCode: CreatePostResponse.code,
    // });
  }

  @Patch('/:postId')
  @UseGuards(RolesGuard)
  // swagger
  @ApiBody({ type: UpdatePostDTO })
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: PostNotFound.message })
  @ApiForbiddenResponse({ description: UnAuthorizedUser.message })
  @ApiOkResponse({ type: UpdatePostResponse.type, description: UpdatePostResponse.message })
  @ApiParam({
    name: 'postId',
    description: '수정할 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 수정 API 입니다.', summary: '게시물 수정' })
  async updatePost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() updatePostDTO: UpdatePostDTO,
  ) {
    const {
      user: { post },
    } = req;
    await this.postService.updatePost(updatePostDTO, post);

    res.status(UpdatePostResponse.code).json(createResponseData<UpdatePostDTO>(UpdatePostResponse, updatePostDTO));

    // response 수정 필요
    // responseHandler(res, {
    //   json: createResponseData<UpdatePostDTO>(UpdatePostResponse, updatePostDTO),
    //   statusCode: UpdatePostResponse.code,
    // });
  }

  @Delete('/:postId')
  @UseGuards(RolesGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: PostNotFound.message })
  @ApiForbiddenResponse({ description: UnAuthorizedUser.message })
  @ApiNoContentResponse({ description: DeletePostResponse.message })
  @ApiParam({
    name: 'postId',
    description: '삭제할 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 삭제 API 입니다. 복구 가능합니다.', summary: '게시물 삭제' })
  async deletePost(@Res({ passthrough: true }) res: Response, @Param('postId') postId) {
    await this.postService.deletePost(postId);

    res.status(DeletePostResponse.code);

    // response 수정 필요
    // responseHandler(res, {
    //   statusCode: DeletePostResponse.code,
    // });
  }

  @Patch('/restore/:postId')
  @UseGuards(RolesGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: PostNotFound.message })
  @ApiForbiddenResponse({ description: UnAuthorizedUser.message })
  @ApiOkResponse({ description: RestorePostResponse.message })
  @ApiParam({
    name: 'postId',
    description: '복구할 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 복구 API 입니다.', summary: '게시물 복구' })
  async restorePost(@Res({ passthrough: true }) res: Response, @Param('postId') postId) {
    await this.postService.restorePost(postId);

    res.status(RestorePostResponse.code);

    // response 수정 필요
    // responseHandler(res, {
    //   statusCode: RestorePostResponse.code,
    // });
  }

  @Get('/:postId')
  // swagger
  @ApiOkResponse({ description: GetPostResponse.message, type: GetPostResponse.type })
  @ApiParam({
    name: 'postId',
    description: '상세 조회할 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 상세 조회 API 입니다.', summary: '게시물 상세 조회' })
  async getPost(@Res({ passthrough: true }) res: Response, @Param('postId') postId) {
    const post = await this.postService.getPost(postId);

    res.status(GetPostResponse.code).json(createResponseData<PostType>(GetPostResponse, post));

    // responseHandler(res, {
    //   json: createResponseData<PostType>(GetPostResponse, post),
    //   statusCode: GetPostResponse.code,
    // });
  }

  @Get('')
  // swagger
  @ApiOkResponse({ description: GetPostsResponse.message, type: GetPostsResponse.type, isArray: true })
  @ApiQuery({
    name: 'sortBy',
    description: '게시물 정렬 조건',
    example: 'createdAt',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'orderBy',
    description: '게시물 정렬 방식(오름차순/내림차순)',
    example: 'asc',
    required: false,
    isArray: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'search',
    description: '제목 혹은 본문 검색시 사용될 키워드',
    example: '제목',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'hashtags',
    description: '게시물 검색 기준이 될 해시태그들',
    example: '서울,맛집',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'page',
    description: '검색한 게시물 보여줄 페이지',
    example: '1',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'limit',
    description: '검색한 게시물 보여줄 최대 갯수',
    example: '10',
    required: false,
    allowEmptyValue: true,
  })
  @ApiOperation({ description: '게시물 목록 조회 API 입니다.', summary: '게시물 목록 조회' })
  async getPosts(
    @Res({ passthrough: true }) res: Response,
    @Query(
      'sortBy',
      new DefaultValuePipe(['createdAt']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    sortBy: SortBysType,
    @Query(
      'orderBy',
      new DefaultValuePipe(['asc']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderBy: OrderBysType,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query(
      'hashtags',
      new DefaultValuePipe(['']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    hashtags: string[],
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    limit: number,
  ) {
    const getPostsDTO: GetPostsDTO = { sortBy, orderBy, search, hashtags, page, limit };
    const posts = await this.postService.getPosts(getPostsDTO);

    res.status(GetPostsResponse.code).json(createResponseData<Posts>(GetPostsResponse, posts));

    // responseHandler(res, {
    //   json: createResponseData<Posts>(GetPostsResponse, posts),
    //   statusCode: GetPostsResponse.code,
    // });
  }
}
