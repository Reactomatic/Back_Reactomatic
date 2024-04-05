import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';  
import { UserModule } from './user/user.module';
import { dataSourceOptions } from 'database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
  ],
})
export class AppModule { }
