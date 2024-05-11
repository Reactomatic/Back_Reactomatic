import { Module } from '@nestjs/common';
import { UserController } from './user.controller'; // Assurez-vous d'importer votre UserController
import { UserService } from './user.service';
import { usersProviders } from './user.providers';
import { DatabaseModule } from 'database/database.module'; // Le chemin doit être correct.

@Module({
  imports: [DatabaseModule],
  controllers: [UserController], // Ajoutez votre UserController ici
  providers: [
    ...usersProviders,
    UserService,
  ],
})
export class UserModule {}