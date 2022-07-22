import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/utils/helper/getUserDecorator';
import { MSG } from 'src/utils/responseHandler/response.enum';
import { ArticleService } from './article.service';
import { DefaultResponse } from './dto/article.response';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { Article } from './entities/article.entity';
import { LikeService } from './like/like.service';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly likeService: LikeService,
  ) {}

  /**
   * @description 게시글 상세 내용 요청
   * */
  @ApiResponse({ description: MSG.getOneArticle.msg })
  @Get('/:id')
  async getOneArticle(@Param('id') articleId: number): Promise<object> {
    const result = await this.articleService.getArticle(articleId);
    return DefaultResponse.response(
      result,
      MSG.getOneArticle.code,
      MSG.getOneArticle.msg,
    );
  }

  /**
   * @description 게시글 리스트 요청
   * */
  @ApiResponse({ description: MSG.getArticleList.msg })
  @Get()
  async getArticleList(
    @Query('limit') limit: number | null,
    @Query('offset') offset: number | null,
  ): Promise<object> {
    const result = await this.articleService.getArticleList(limit, offset);
    return DefaultResponse.response(
      result,
      MSG.getArticleList.code,
      MSG.getArticleList.msg,
    );
  }

  /**
   * @description 게시글 생성
   * */
  @ApiBody({ type: CreateArticleDTO })
  @ApiCreatedResponse({ description: MSG.createArticle.msg })
  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createArticle(
    @Body() createArticleData: CreateArticleDTO,
    @GetUser() user: User,
  ) {
    const result = await this.articleService.createArticle(
      createArticleData,
      user,
    );
    return DefaultResponse.response(
      result,
      MSG.createArticle.code,
      MSG.createArticle.msg,
    );
  }

  //   /**
  //    * @description 게시글 수정
  //    * */
  @ApiCreatedResponse({ description: MSG.deleteArticle.msg })
  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async updateArticle(
    @Param('id') articleId: number,
    @Body() updateArticleData: UpdateArticleDTO,
    @GetUser() user: User,
  ) {
    const result = await this.articleService.updateArticle(
      articleId,
      updateArticleData,
      user,
    );
    return DefaultResponse.response(
      result,
      MSG.updateArticle.code,
      MSG.updateArticle.msg,
    );
  }

  /**
   * @description 게시글 삭제
   * */

  @ApiCreatedResponse({ description: MSG.deleteArticle.msg })
  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteArticle(@Param('id') articleId: number, @GetUser() user: User) {
    const result = await this.articleService.deleteArticle(articleId, user);
    return DefaultResponse.response(
      result,
      MSG.deleteArticle.code,
      MSG.deleteArticle.msg,
    );
  }

  /**
   * @description 게시글 좋아요 요청
   * */
  @ApiCreatedResponse({ description: MSG.likeArticle.msg })
  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Post('/like/:id')
  async likeArticle(@Param('id') articleId: number, @GetUser() user: User) {
    const result = await this.likeService.likeArticle(articleId, user);
    return DefaultResponse.response(
      result,
      MSG.likeArticle.code,
      MSG.likeArticle.msg,
    );
  }

  /**
   * @description 게시글 좋아요 취소 요청
   * */
  @ApiCreatedResponse({ description: MSG.unlikeArticle.msg })
  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/like/:id')
  async unlikeArticle(@Param('id') articleId: number, @GetUser() user: User) {
    const result = await this.likeService.unLikeArticle(articleId, user);
    return DefaultResponse.response(
      result,
      MSG.unlikeArticle.code,
      MSG.unlikeArticle.msg,
    );
  }
}
