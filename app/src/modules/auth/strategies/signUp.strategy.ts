import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONSTANT_SIGN_UP } from 'src/constants';
import AuthService from '../auth.service';

@Injectable()
export default class SignUpStrategy extends PassportStrategy(Strategy, CONSTANT_SIGN_UP) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'nickname',
      passReqToCallback: false,
    });
  }

  async validate(email: string, nickname: string) {
    try {
      return await this.authService.validateUser(email, nickname);
    } catch (err) {
      throw err;
    }
  }
}
