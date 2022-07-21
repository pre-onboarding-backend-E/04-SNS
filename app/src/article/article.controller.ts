import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/utils/helper/getUserDecorator';
import { MSG } from 'src/utils/responseHandler/response.enum';
import { ArticleService } from './article.service';
import { DefaultResponse } from './dto/article.response';
import { CreateArticleDTO } from './dto/createArticle.dto';

@ApiTags('Articles')
@ApiBearerAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //   /**
  //    * @description 게시글 상세 내용 요청
  //    * */
  //   @Get()
  //   async getOneArticle() {}

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
  //   @Patch()
  //   async updateArticle() {}

  //   /**
  //    * @description 게시글 삭제
  //    * */
  //   @Delete()
  //   async deleteArticle() {}
}
