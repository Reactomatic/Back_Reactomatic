import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { usersProviders } from './user.providers';
import { DatabaseModule } from 'database/database.module'; 

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...usersProviders,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}