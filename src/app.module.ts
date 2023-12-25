import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { UsersController } from './controller/users.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/users.repository';
import { SignupController } from './controller/signup.controller';
import { SignupService } from './service/signup.service';
import { LoginController } from './controller/login.controller';
import { LoginService } from './service/login.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2312',
      database: 'postgres',
      entities: [Users],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UsersController, SignupController, LoginController],
  providers: [
    JwtService,
    UserService,
    UserRepository,
    SignupService,
    LoginService,
  ],
})
export class AppModule {}
