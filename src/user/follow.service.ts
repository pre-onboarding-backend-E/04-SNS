import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorType } from 'src/common/type/error-type.enum';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Follow } from './entity/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}
  
  /**
   * @description 팔로우 관계를 생성
  */
  async follow(following: User, follower: User) {
    const isSameUser = following.id === follower.id;

    if (isSameUser) {
      throw new HttpException(ErrorType.canNotFollowSameUser.message, ErrorType.canNotFollowSameUser.code);
    }

    try {
      const follow: Follow = await this.followRepository.create({ 
        follower, following 
    });
      
      await this.followRepository.save(follow);
    } catch (error) {
      console.error(error);
      throw new HttpException(ErrorType.databaseServerError.message, ErrorType.databaseServerError.code);
    }
  }

  /**
   * @description 팔로우 관계를 해제
  */
  async unfollow(following: User, follower: User) {
    try {
      const result = await this.followRepository
        .createQueryBuilder('follow')
        .delete()
        .where('follow.followerId = :followerId', { followrId: follower.id })
        .andWhere('follow.followingId = :followingId', { followingId: following.id })
        .execute();

      if (result.affected === 0) {
        throw new HttpException(ErrorType.followNotFound.message, ErrorType.followNotFound.code);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(ErrorType.serverError.message, ErrorType.serverError.code);
    }
  }
}