import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_LOGIN } from 'src/constants';

@Injectable()
export default class LoginGuard extends AuthGuard(CONSTANT_LOGIN) {}
