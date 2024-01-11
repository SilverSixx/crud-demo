import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repo/employee.repo';
import { Employee } from '../entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { CompanyRepository } from '../../company/repos/company.repo';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<object> {
    try {
      const employee = await this.findByEmail(createEmployeeDto.email);

      if (employee) {
        throw new HttpException(
          'Employee email exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newEmployee = new Employee();
      newEmployee.employee_name = createEmployeeDto.name;
      newEmployee.employee_email = createEmployeeDto.email;
      newEmployee.employee_password = await bcrypt.hash(
        createEmployeeDto.password,
        10,
      );
      newEmployee.employee_role = createEmployeeDto.role;
      return await this.employeeRepository.save(newEmployee);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<object[]> {
    try {
      return await this.employeeRepository
        .createQueryBuilder('employee')
        .getMany();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      return await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.id = :id', { id })
        .getOne();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<object> {
    try {
      const existingEmployee = await this.employeeRepository
        .createQueryBuilder('employee')
        .leftJoinAndSelect('employee.company', 'company')
        .where('employee.id = :id', { id })
        .getOne();

      if (!existingEmployee) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      existingEmployee.employee_name = updateEmployeeDto.name;
      existingEmployee.employee_email = updateEmployeeDto.email;
      existingEmployee.employee_password = await bcrypt.hash(
        updateEmployeeDto.password,
        10,
      );
      existingEmployee.employee_role = updateEmployeeDto.role;
      const updatedEmployee =
        await this.employeeRepository.save(existingEmployee);

      if (updateEmployeeDto.company_id) {
        const updatedCompany = await this.companyRepository
          .createQueryBuilder('company')
          .leftJoinAndSelect('company.employees', 'employees')
          .where('company.id = :id', { id: updateEmployeeDto.company_id })
          .getOne();

        if (!updatedCompany) {
          throw new HttpException('Company not found', HttpStatus.BAD_REQUEST);
        }
        existingEmployee.company = updatedCompany;
      }
      return updatedEmployee;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const employeeToRemove = await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.id = :id', { id })
        .getOne();
      if (!employeeToRemove) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      return await this.employeeRepository.remove(employeeToRemove);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async isEmailExists(email: string): Promise<boolean> {
    const result = await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.employee_email = :email', { email })
      .getOne();
    return !!result;
  }

  async findByEmail(email: string): Promise<Employee> {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.employee_email = :email', { email })
      .getOne();
  }
}
