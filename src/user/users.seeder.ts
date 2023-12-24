import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class SeederService {
  constructor(private readonly userService: UserService) {}

  async seedUsers() {
    const usersToSeed = [
      { user_name: 'employee1', user_password: 'epass', user_role: 'employee' },
      { user_name: 'admin1', user_password: 'apass', user_role: 'admin' },
    ];

    for (const userData of usersToSeed) {
      await this.userService.createUser(userData);
    }
  }
}
