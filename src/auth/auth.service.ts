import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { compare } from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    readonly jwtService: JwtService,
    readonly userService: UserService,
  ) {
    return this;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('The user does not exist.');
    }
    const isPasswordMatched = await compare(password, user.password);
    if (! isPasswordMatched) {
      throw new UnauthorizedException('Your password is incorrect.');
    }
    return user;
  }

  async generateToken(user: User): Promise<string> {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
