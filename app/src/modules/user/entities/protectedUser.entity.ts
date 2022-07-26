import { ApiProperty } from '@nestjs/swagger';

export default class ProtectedUser {
  @ApiProperty({ description: '유저 이메일', example: 'test@mail.com' })
  email: string;

  @ApiProperty({ description: '유저 닉네임', example: '한글nickname123' })
  nickname: string;
}
