import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user';
import { compare } from 'src/utils/bcrypt';
import {
  UserAlreadyExistNickname,
  UserAlreadyExistEmail,
  UserNotFound,
  WrongPassword,
  PostNotFound,
  UnAuthorizedUser,
  UnAuthorizedToken,
} from 'src/status/error';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.schema';
import { PostRepository } from '../post';
import { PostDocument } from '../post/post.schema';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly postRepository: PostRepository,
  ) {}

  async authorizeUser(email: string, postId: string): Promise<PostDocument> {
    try {
      const post = await this.postRepository.getPostById(postId);

      if (!post) {
        throw new NotFoundException(PostNotFound.message);
      }

      if (post.email !== email) {
        throw new ForbiddenException(UnAuthorizedUser.message);
      }

      return post;
    } catch (err) {
      throw err;
    }
  }

  async validateEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException(UserNotFound.message);
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async validateNickname(email: string): Promise<User> {
    try {
      const user = await this.userRepository.getUserByNickname(email);

      if (!user) {
        throw new NotFoundException(UserNotFound.message);
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async validateUser(email: string, nickname: string): Promise<boolean> {
    try {
      const existedEmail = await this.userRepository.getUserByEmail(email);

      if (!!existedEmail) {
        throw new BadRequestException(UserAlreadyExistEmail.message);
      }

      const existedNickname = await this.userRepository.getUserByNickname(nickname);

      if (!!existedNickname) {
        throw new BadRequestException(UserAlreadyExistNickname.message);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isCorrectPassword = await compare(password, hashedPassword);

      if (!isCorrectPassword) {
        throw new BadRequestException(WrongPassword.message);
      }

      return isCorrectPassword;
    } catch (err) {
      throw err;
    }
  }

  async validateRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
    try {
      const isCorrectRefreshToken = await compare(refreshToken, hashedRefreshToken);

      if (!isCorrectRefreshToken) {
        throw new UnauthorizedException(UnAuthorizedToken.message);
      }

      return isCorrectRefreshToken;
    } catch (err) {
      throw err;
    }
  }

  async createAccessToken(email: string): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRESIN'),
      },
    );

    return accessToken;
  }

  async createRefreshToken(email: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRESIN'),
      },
    );

    return refreshToken;
  }
}
