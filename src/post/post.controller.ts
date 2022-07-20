import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorator/currenUser';
import { User } from '..//user/user.entity';
import { CreatePostInput } from './dto/createPost.input';
import { UpdatePostInput } from './dto/update.post.input';
import { Post as PostEntity } from './entity/post.entity';
import { PostService } from './post.service';

@ApiTags('SNS post')
@Controller()
export class PostController {
  constructor(readonly postService: PostService) {
    return this;
  }

  // public api
  @Get('/post/:id')
  async post(@Param() params: { id: number }): Promise<PostEntity> {
    return this.postService.findOne(params.id);
  }

  // public api
  @Get('/posts')
  async posts(
    @Query() query: { take: number; skip: number },
  ): Promise<PostEntity[]> {
    console.log(query.take, typeof query.take);
    return this.postService.findAllPosts(query.take, query.skip);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async createPost(
    @CurrentUser() user: User,
    @Body() input: CreatePostInput,
  ): Promise<PostEntity> {
    return this.postService.createPost(user, input);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/post/:id')
  async updatePost(
    @CurrentUser() user: User,
    @Param() param: { id: number },
    @Body() input: UpdatePostInput,
  ): Promise<PostEntity> {
    const post = await this.postService.findOne(param.id);

    return this.postService.updatePost(post, input);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('/post/:id')
  async deletePost(
    @CurrentUser() user: User,
    @Param() id: number,
  ): Promise<PostEntity> {
    let post = await this.postService.findOne(id);

    return post;
  }
}
