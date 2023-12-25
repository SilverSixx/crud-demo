import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }
  async isUsernameExists(user_name: string): Promise<boolean> {
    const user = await this.findOne({ where: { user_name: user_name } });
    return !!user;
  }
}
