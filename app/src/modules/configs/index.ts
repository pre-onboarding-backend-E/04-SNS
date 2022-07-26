import { ConfigModule } from '@nestjs/config';

export const ConfigsModule = ConfigModule.forRoot({
  isGlobal: true,
});
