import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepo } from './user.repository';
import { IUserRepo } from './interfaces/user-repo.interface';
import { IUserService } from './interfaces/user-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepo,
      useClass: UserRepo,
    },
  ],
  exports: [TypeOrmModule, IUserService, IUserRepo],
})
export class UserModule {}
