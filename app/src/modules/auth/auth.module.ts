import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SignUpStrategy, LoginStrategy, AccessJWTStrategy, RefreshJWTStrategy, RolesStrategy } from './strategies';
import { UserModule } from '../user';
import { PostModule } from '../post';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN },
    }),
    UserModule,
    PostModule,
  ],
  providers: [AuthService, SignUpStrategy, LoginStrategy, AccessJWTStrategy, RefreshJWTStrategy, RolesStrategy],
  exports: [AuthService],
})
export default class AuthModule {}
