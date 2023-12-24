import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async createUser(user: Partial<Users>): Promise<Users> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async usernameExists(username: string): Promise<Boolean> {
    return this.userRepository.isUsernameExists(username);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { user_name: username },
    });

    if (user && (await bcrypt.compare(password, user.user_password))) {
      return user;
    }
    return null;
  }

  async getUserRole(user_name: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { user_name: user_name },
    });
    return user.user_role;
  }
}
