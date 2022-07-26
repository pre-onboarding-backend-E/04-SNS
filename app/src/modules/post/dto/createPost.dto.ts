import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreatePostDTO {
  @ApiProperty({ description: '게시물 제목', example: '게시물 1의 제목' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: '게시물 본문', example: '게시물 1의 본문' })
  @IsString()
  @IsNotEmpty()
  readonly contents: string;

  @ApiProperty({ description: '해시태그, #으로 시작하고 ,로 구분', example: '#맛집,#서울,#브런치 카페,#주말' })
  @IsString()
  @IsNotEmpty()
  hashtags: string | string[];
}
