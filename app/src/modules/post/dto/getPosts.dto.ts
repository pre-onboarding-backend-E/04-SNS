import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { OrderBys, OrderBysType, SortBysType, SortBys } from 'src/utils/customTypes';

export default class GetPostsDTO {
  @ApiProperty({ description: '게시물 정렬 조건들', example: 'createdAt,likes' })
  @IsIn(SortBys, { each: true })
  @IsString({ each: true })
  readonly sortBy: SortBysType;

  @ApiProperty({ description: '게시물 정렬 방식(오름차순/내림차순)', example: 'asc' })
  @IsIn(OrderBys, { each: true })
  @IsString({ each: true })
  readonly orderBy: OrderBysType;

  @ApiProperty({ description: '제목 혹은 본문 검색 시 사용될 키워드', example: '후기' })
  readonly search: string;

  @ApiProperty({ description: '게시물 검색 기준이 될 해시태그들', example: '서울,맛집' })
  @IsString({ each: true })
  readonly hashtags: string[];

  @ApiProperty({ description: '검색한 게시물 보여줄 페이지', example: '1' })
  @IsNumber()
  readonly page: number;

  @ApiProperty({ description: '검색한 게시물 보여줄 최대 갯수', example: '10' })
  @IsNumber()
  readonly limit: number;
}
