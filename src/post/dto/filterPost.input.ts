import { ApiProperty } from '@nestjs/swagger';

export class filterPostDto {
  // searching (검색) - 제목
  @ApiProperty({ nullable: true })
  keyword: Array<string>;

  // filtering - 해시 태그 (명확하게 일치하는 것만)
  @ApiProperty({ nullable: true })
  tag: Array<string>;

  // ordering (정렬) - 기본 작성일 / 옵션 : 작성일/좋아요/ 조회 수
  @ApiProperty({
    description:
      'createdDesc(내림차 순)/createdAsc(오름차 순) 중 선택할 수 있습니다',
    example: 'createdDesc',
    default: 'createdDesc',
    nullable: true,
  })
  sortedType: string;
}
