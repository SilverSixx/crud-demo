import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UsersController } from './user/users.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/users.repository';
import { SeederService } from './user/users.seeder';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2312',
      database: 'postgres',
      entities: [User], // Add your entities here
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UserService, SeederService, UserRepository],
})
export class AppModule {}
