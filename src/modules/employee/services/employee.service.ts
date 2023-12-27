import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repo/employee.repo';
import { Employee } from '../entities/employee.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = new Employee();
    newEmployee.employee_name = createEmployeeDto.name;
    newEmployee.employee_email = createEmployeeDto.email;
    newEmployee.employee_password = await bcrypt.hash(createEmployeeDto.password, 10);
    newEmployee.employee_role = createEmployeeDto.role;
    return await this.employeeRepository.save(newEmployee);
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async isEmailExists(email: string): Promise<boolean> {
    return this.employeeRepository.isEmailExists(email);
  }
  async findByEmail(email: string): Promise<Employee>{
    return this.employeeRepository.findByEmail(email);
  }

}
