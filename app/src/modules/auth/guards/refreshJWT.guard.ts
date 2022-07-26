import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_REFRESH } from 'src/constants';

@Injectable()
export default class RefreshJWTGuard extends AuthGuard(CONSTANT_REFRESH) {}
