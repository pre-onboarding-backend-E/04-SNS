export * as UserSchema from './user.schema';
export * as UserDTO from './dto';
export * as UserEntities from './entities';
export { default as UserRepository } from './user.repository';
export { default as UserService } from './user.service';
export { default as UserController } from './user.controller';
export { default as UserModule } from './user.module';

// https://www.tevpro.com/blog/nestjs-resolving-dependency-injection-the-order-matters
// 밑의 순서로 하면 에러................................

// export { default as UserController } from './user.controller';
// export { default as UserModule } from './user.module';
// export { default as UserService } from './user.service';
// export { default as UserRepository } from './user.repository';
// export * as UserSchema from './user.schema';
// export * as UserDTO from './dto';
// export * as UserEntities from './entities';
