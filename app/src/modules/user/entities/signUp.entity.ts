import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/response';
import ProtectedUser from './protectedUser.entity';

export default class SignUp extends BaseResponse {
  @ApiProperty({ description: '회원가입 된 유저 정보' })
  user: ProtectedUser;
}
