import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export default class LoginDTO {
  @ApiProperty({ description: '이메일', example: 'test@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: '비밀번호 (8~20글자 영문/숫자)',
    example: 'password1234',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 8~20글자의 영문과 숫자만 가능합니다.',
  })
  @IsNotEmpty()
  readonly password: string;
}
