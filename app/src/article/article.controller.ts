import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { Article } from './entities/article.entity';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * @description 게시글 상세 내용 요청
   * */
  @ApiResponse({ description: MSG.getOneArticle.msg })
  @Get('/:id')
  async getOneArticle(@Param('id') articleId: number): Promise<object> {
    return await this.articleService.getOneArticle(articleId);
  }

  //   /**
  //    * @description 게시글 리스트 요청
  //    * */
  //   @Get()
  //   async getArticleList() {}

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
  // @ApiCreatedResponse({ description: MSG.deleteArticle.msg })
  // @ApiBearerAuth('access_token')
  // @UseGuards(AuthGuard('jwt'))
  // @Patch('/:id')
  // async updateArticle(@Param('id') articleId: number, @GetUser() user: User) {
  //   const result = await this.articleService.updateArticle(articleId, user);
  //   return DefaultResponse.response(
  //     result,
  //     MSG.updateArticle.code,
  //     MSG.updateArticle.msg,
  //   );
  // }

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
}
