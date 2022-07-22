import { Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @ApiOperation({
    summary: '좋아요 추가 API',
    description: '게시글 좋아요 누르기',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  createdHeart(@Param('postId', ParseIntPipe) postId: number, @Req() req) {
    return this.likeService.createdHeart(postId, req.user.userId);
  }

  @Delete(':postId')
  @ApiOperation({
    summary: '좋아요 취소 API',
    description: '게시글 좋아요 취소',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  deleteHeart(@Param('postId', ParseIntPipe) postId: number, @Req() req) {
    return this.likeService.deleteHeart(postId, req.user.userId);
  }

  @Get('count/:postId')
  @ApiOperation({
    summary: '좋아요 카운트 API',
    description: '게시글 좋아요 개수 리턴',
  })
  getHeartCount(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.getHeartCount(postId);
  }

  @Get(':postId')
  @ApiOperation({
    summary: '좋아요 누른 유저목록 API',
    description: '게시글 좋아요 누른 유저목록 반환',
  })
  getAllLikedUser(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.getAllLikedUser(postId);
  }
}
function JwtAuthGuard(JwtAuthGuard: any) {
  throw new Error('Function not implemented.');
}
