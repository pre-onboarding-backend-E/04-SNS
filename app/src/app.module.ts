import { Module } from '@nestjs/common';
import { UserModule, AuthModule, ConfigsModule, DBModule, PostModule, LikeModule } from './modules';

@Module({
  imports: [ConfigsModule, DBModule, UserModule, PostModule, AuthModule, LikeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
