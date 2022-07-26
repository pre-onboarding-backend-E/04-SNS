// import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Request } from 'express';
// import { ProtectedUser } from 'src/modules/user/entities';
// import { ForbiddenUser } from 'src/status/error';
import { SetMetadata } from '@nestjs/common';
import { CONSTANT_ROLES } from 'src/constants';

// export const AuthorizeUser = createParamDecorator((_, ctx: ExecutionContext): ProtectedUser => {
//   const {
//     user: { user },
//     params,
//   } = ctx.switchToHttp().getRequest<Request>();

//   if (user.email !== params.email) {
//     throw new ForbiddenException(ForbiddenUser.message);
//   }

//   return user;
// });

export const Role = (role: string) => SetMetadata(CONSTANT_ROLES, role);
