import { Body, Controller, Post, Get, Res, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignUpGuard, LoginGuard, RefreshJWTGuard } from '../auth/guards';
import { CreateUserDTO, LoginDTO } from './dto';
import UserService from './user.service';
import { Response, Request } from 'express';
import { CONSTANT_ACCESS, CONSTANT_REFRESH } from 'src/constants';
import { createResponseData, defaultTokenCookieOption, responseHandler } from 'src/utils/response';
import { hash } from 'src/utils/bcrypt';
import {
  UnAuthorizedToken,
  UserAlreadyExistEmail,
  UserAlreadyExistNickname,
  UserNotFound,
  WrongPassword,
} from 'src/status/error';
import { LoginResponse, RefreshTokenResponse, SignUpResponse } from 'src/status/success';
import { ProtectedUser } from './entities';

@ApiTags('users')
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  @UseGuards(SignUpGuard)
  // swagger
  @ApiBody({ type: CreateUserDTO })
  @ApiBadRequestResponse({ description: UserAlreadyExistEmail.message })
  @ApiBadRequestResponse({ description: UserAlreadyExistNickname.message })
  @ApiCreatedResponse({ type: SignUpResponse.type, description: SignUpResponse.message })
  @ApiOperation({ description: '유저 회원가입 API 입니다.', summary: '유저 회원가입' })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.signUp(createUserDTO);

    res.status(SignUpResponse.code).json(createResponseData<ProtectedUser>(SignUpResponse, user));

    // responseHandler(res, {
    //   json: createResponseData<ProtectedUser>(SignUpResponse, user),
    //   statusCode: SignUpResponse.code,
    // });
  }

  @Post('login')
  @UseGuards(LoginGuard)
  // swagger
  @ApiBody({ type: LoginDTO })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiBadRequestResponse({ description: WrongPassword.message })
  @ApiOkResponse({ description: LoginResponse.message })
  @ApiOperation({ description: '유저 로그인 API 입니다.', summary: '유저 로그인' })
  async login(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const {
      user: {
        user: { email },
        tokens: { accessToken, refreshToken },
      },
    } = req;

    const hashedRefreshToken = await hash(refreshToken);

    await this.userService.setRefreshToken({ email, hashedRefreshToken });

    res
      .cookie(CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true))
      .cookie(CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false))
      .status(LoginResponse.code)
      .json(createResponseData(LoginResponse));

    // responseHandler(res, {
    //   cookie: [
    //     [CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true)],
    //     [CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false)],
    //   ],
    //   statusCode: LoginResponse.code,
    //   json: createResponseData(LoginResponse),
    // });
  }

  @Get('refreshAccessToken')
  @UseGuards(RefreshJWTGuard)
  // swagger
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiOkResponse({ description: RefreshTokenResponse.message })
  @ApiCookieAuth(CONSTANT_REFRESH)
  @ApiOperation({ description: '유저 토큰 재발급 API 입니다.', summary: '유저 토큰 재발급' })
  async refreshAccessToken(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const {
      user: {
        user: { email },
        tokens: { accessToken, refreshToken },
      },
    } = req;

    const hashedRefreshToken = await hash(refreshToken);

    await this.userService.setRefreshToken({ email, hashedRefreshToken });

    res
      .cookie(CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true))
      .cookie(CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false))
      .status(RefreshTokenResponse.code);

    // responseHandler(res, {
    //   cookie: [
    //     [CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true)],
    //     [CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false)],
    //   ],
    //   statusCode: RefreshTokenResponse.code,
    //   json: createResponseData(RefreshTokenResponse),
    // });
  }
}
