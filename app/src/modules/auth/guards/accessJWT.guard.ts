import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_ACCESS } from 'src/constants';

@Injectable()
export default class AccessJWTGuard extends AuthGuard(CONSTANT_ACCESS) {}
