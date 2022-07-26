import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_SIGN_UP } from 'src/constants';

@Injectable()
export default class SignUpGuard extends AuthGuard(CONSTANT_SIGN_UP) {}
