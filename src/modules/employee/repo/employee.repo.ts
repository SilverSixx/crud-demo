import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(private dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }
  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { employee_email: email } });
    return !!user;
  }
  async findByEmail(email: string): Promise<Employee>{
    return await this.findOne({ where: { employee_email: email } });
  }
}
