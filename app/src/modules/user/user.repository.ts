import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export default class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO, hashedPassword: string): Promise<User> {
    const user = await this.userModel.create({ ...createUserDTO, hashedPassword });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async getUserByNickname(nickname: string): Promise<User | null> {
    const user = await this.userModel.findOne({ nickname });

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO) {
    const { email, ...update } = updateUserDTO;

    const user = await this.userModel.findOneAndUpdate({ email }, update, { new: true });

    return user;
  }
}
