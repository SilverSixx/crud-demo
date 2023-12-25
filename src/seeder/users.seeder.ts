import { Injectable } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Injectable()
export class SeederService {
  constructor(private readonly userService: UserService) {}

  async seedUsers() {
    const usersToSeed = [
      { username: 'employee1', password: 'epass', role: 'employee' },
      { username: 'admin1', password: 'apass', role: 'admin' },
    ];

    for (const userData of usersToSeed) {
      await this.userService.createUser(userData);
    }
  }
}
