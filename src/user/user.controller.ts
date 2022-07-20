import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './decorator/currenUser';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(
    readonly userService: UserService, // readonly postService: PostService,
  ) {
    return this;
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  async user(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findOneById(id);
    return user;
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/users')
  async users(@Query() query: { take: number; skip: number }): Promise<User[]> {
    return this.userService.find(query.take, query.skip);
  }

  @Post('/user/register')
  async createUser(@Body() input: CreateUserInput): Promise<User> {
    return await this.userService.createUser(input);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/user')
  async updateUser(
    @CurrentUser() user: User,
    @Body() input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(user, input);
  }
}
