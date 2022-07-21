import { ApiProperty } from '@nestjs/swagger';

export class filterPostDto {
  // searching (검색) - 제목
  @ApiProperty({ nullable: true, required: false })
  keyword?: Array<string>;

  // filtering - 해시 태그 (명확하게 일치하는 것만)
  @ApiProperty({ nullable: true, required: false })
  tag?: Array<string>;

  // ordering (정렬) - 기본 작성일 / 옵션 : 작성일/좋아요/ 조회 수
  @ApiProperty({
    description: 'DESC(내림차 순)/ASC(오름차 순) 중 선택할 수 있습니다',
    example: 'DESC',
    default: 'DESC',
    nullable: true,
    required: false,
  })
  sortedType?: string;

  @ApiProperty({ nullable: true, required: false, default: 5 })
  take?: number;

  @ApiProperty({ nullable: true, required: false, default: 0 })
  skip?: number;
}
