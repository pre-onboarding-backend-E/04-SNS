import { Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessJWTGuard } from '../auth/guards';
import { Response, Request } from 'express';
import { createResponseData, responseHandler } from 'src/utils/response';
import LikeService from './like.service';
import { CONSTANT_ACCESS } from 'src/constants';
import { UnAuthorizedToken, UserNotFound } from 'src/status/error';
import { LikeCreatedResponse, LikeNoContentResponse, UnlikeResponse } from 'src/status/success';

@ApiTags('likes')
@Controller('likes')
export default class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Put('/like/:postId')
  @UseGuards(AccessJWTGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiCreatedResponse({ description: LikeCreatedResponse.message })
  @ApiNoContentResponse({ description: LikeNoContentResponse.message })
  @ApiParam({
    name: 'postId',
    description: '좋아요 누른 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 좋아요 API 입니다.', summary: '게시물 좋아요' })
  async likePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;

    const isInserted = await this.likeService.likePost(email, postId);

    res
      .status(isInserted ? LikeCreatedResponse.code : LikeNoContentResponse.code)
      .json(createResponseData(isInserted ? LikeCreatedResponse : LikeNoContentResponse));

    // responseHandler(res, {
    //   statusCode: isInserted ? LikeCreatedResponse.code : LikeNoContentResponse.code,
    //   json: createResponseData(isInserted ? LikeCreatedResponse : LikeNoContentResponse),
    // });
  }

  @Put('/unlike/:postId')
  @UseGuards(AccessJWTGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiNoContentResponse({ description: UnlikeResponse.message })
  @ApiParam({
    name: 'postId',
    description: '좋아요 취소한 게시물 고유 식별 ID',
    required: true,
    example: '62deb22c5a02cd86349c40f5',
  })
  @ApiOperation({ description: '게시물 좋아요 취소 API 입니다.', summary: '게시물 좋아요 취소' })
  async unlikePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;

    await this.likeService.unlikePost(email, postId);

    res.status(UnlikeResponse.code).json(createResponseData(UnlikeResponse));

    // responseHandler(res, {
    //   statusCode: UnlikeResponse.code,
    //   json: createResponseData(UnlikeResponse),
    // });
  }
}
