import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDTO {
  @ApiProperty({
    description: '게시글 제목',
    example: 'NestJS로 게시판 만들기!',
  })
  @IsString()
  @MaxLength(80)
  @MinLength(1)
  @IsNotEmpty()
  readonly title;

  @ApiProperty({
    description: '게시글 내용',
    example: '오늘은 Nest js로 게시판을 만들어보겠습니다! blah blah',
  })
  @IsString()
  @IsNotEmpty()
  readonly content;

  @ApiProperty({
    description: '해시태그',
    example: '#맛집,#서울,#브런치 카페,#주말',
  })
  @IsString()
  // @Matches('^#[가-힣a-zA-Z0-9]')
  readonly hashtag;
}
