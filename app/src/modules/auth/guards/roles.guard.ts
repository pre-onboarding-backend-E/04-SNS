import { ExecutionContext } from '@nestjs/common';
import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CONSTANT_ROLES } from 'src/constants';
import AuthService from '../auth.service';
// import { Reflector } from '@nestjs/core';
// import { CONSTANT_ROLES } from 'src/constants';

// @Injectable()
// export default class RolesGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) /* private reflector: Reflector */ {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // const requiredRole = this.reflector.getAllAndOverride<string>(CONSTANT_ROLES, [
//     //   context.getHandler(),
//     //   context.getClass(),
//     // ]);

//     // if (!requiredRole) {
//     //   return true;
//     // }

//     const {
//       // user 는 이전 AccessJWTStrategy 에서 decodeToken payload 이다
//       user: {
//         user: { email },
//       },
//       params: { postId },
//     } = context.switchToHttp().getRequest<Request>();
//     const hasAuthority = await this.authService.authorizeUser(email, postId);

//     return hasAuthority;
//   }
// }
@Injectable()
export default class RolesGuard extends AuthGuard(CONSTANT_ROLES) {}
