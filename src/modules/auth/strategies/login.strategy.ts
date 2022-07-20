import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONSTANT_LOGIN } from 'src/constants';
import AuthService from '../auth.service';
import { Tokens } from '../entities';

@Injectable()
export default class LoginStrategy extends PassportStrategy(Strategy, CONSTANT_LOGIN) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string): Promise<Tokens> {
    try {
      const user = await this.authService.validateEmail(email);
      await this.authService.validatePassword(password, user.hashedPassword);

      const accessToken = this.authService.createAccessToken(email);
      const refreshToken = this.authService.createRefreshToken(email);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
}