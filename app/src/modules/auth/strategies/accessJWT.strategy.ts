import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONSTANT_ACCESS } from 'src/constants';
import AuthService from '../auth.service';
import Payload from '../entities/payload.entity';

@Injectable()
export default class AccessJWTStrategy extends PassportStrategy(Strategy, CONSTANT_ACCESS) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies[CONSTANT_ACCESS]]),
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    });
  }

  async validate({ email }: Payload) {
    try {
      const user = await this.authService.validateEmail(email);

      return { user: user.protectedData };
    } catch (err) {
      throw err;
    }
  }
}
