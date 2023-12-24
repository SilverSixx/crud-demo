import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user/user.entity';
import { UsersController } from './user/users.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/users.repository';
import { SignupController } from './signup/signup.controller';
import { SignupService } from './signup/signup.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
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
