// import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CONSTANT_ACCESS, CONSTANT_ROLES } from 'src/constants';
import { Request } from 'express';
import { UnAuthorizedUser } from 'src/status/error';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthService from '../auth.service';
import Payload from '../entities/payload.entity';

// @Injectable()
// export default class RolesStrategy extends PassportStrategy(Strategy, CONSTANT_ROLES) {
//   constructor() {
//     super({
//       passReqToCallback: true,
//     });
//   }

//   async validate(req: Request) {
//     const {
//       // user 는 이전 AccessJWTStrategy 에서 decodeToken payload 이다
//       user: { user },
//       params: { email },
//     } = req;

//     if (user.email !== email) {
//       throw new ForbiddenException(UnAuthorizedUser.message);
//     }

//     return user;
//   }
// }

@Injectable()
export default class RolesStrategy extends PassportStrategy(Strategy, CONSTANT_ROLES) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies[CONSTANT_ACCESS]]),
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { email }: Payload) {
    const {
      params: { postId },
    } = req;

    try {
      const post = await this.authService.authorizeUser(email, postId);

      return { post };
    } catch (err) {
      throw err;
    }
  }
}
