import { Injectable } from '@nestjs/common';
import { hash } from 'src/utils/bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import ProtectedUser from './entities/protectedUser.entity';
import UserRepository from './user.repository';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<ProtectedUser> {
    const hashedPassword: string = await hash(createUserDTO.password);
    const user = await this.userRepository.createUser(createUserDTO, hashedPassword);

    return user.protectedData;
  }

  async setRefreshToken({ email, hashedRefreshToken }: UpdateUserDTO) {
    await this.userRepository.updateUser({ email, hashedRefreshToken });
  }
}
