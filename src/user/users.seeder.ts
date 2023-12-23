import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class SeederService {
  constructor(private readonly userService: UserService) {}

  async seedUsers() {
    const usersToSeed = [
      { user_name: 'Employee 1', user_role: 'employee' },
      { user_name: 'Employee 2', user_role: 'employee' },
      { user_name: 'Admin 1', user_role: 'admin' },
    ];

    for (const userData of usersToSeed) {
      await this.userService.createUser(userData);
    }
  }
}
