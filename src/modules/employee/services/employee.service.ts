import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../repo/employee.repo';
import { Employee } from '../entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { DataResponse } from '../../auth/dto/data-response.dto';
import { CompanyRepository } from '../../company/repos/company.repo';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository
  ) {
  }
  async create(createEmployeeDto: CreateEmployeeDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
    try {
      const newEmployee = new Employee();
      newEmployee.employee_name = createEmployeeDto.name;
      newEmployee.employee_email = createEmployeeDto.email;
      newEmployee.employee_password = await bcrypt.hash(createEmployeeDto.password, 10);
      newEmployee.employee_role = createEmployeeDto.role;
      response.statusCode = HttpStatus.CREATED;
      response.isError = false;
      response.message = 'Employee created successfully';
      response.data = await this.employeeRepository.save(newEmployee);
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = error.message || 'An error occurred while creating employee';
      response.data = null;
    }
    return response;
  }

  async findAll():Promise<DataResponse<Employee[]>> {
    const response = new DataResponse<Employee[]>();
    try {
      const employees = await this.employeeRepository.find();
      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = 'Employees retrieved successfully';
      response.data = employees;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = 'An error occurred while retrieving employees';
      response.data = null;
    }
    return response;
  }

  async findOne(id: number):Promise<DataResponse<Employee>> {
    const response = new DataResponse<Employee>();
    try {
      const employees = await this.employeeRepository.findOne({where: {id: id}});
      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = `Employees with ${id} retrieved successfully`;
      response.data = employees;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = 'An error occurred while retrieving employee';
      response.data = null;
    }
    return response;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();

    try {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { id: id },
        relations: ['company'],
      });

      if (!existingEmployee) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      existingEmployee.employee_name = updateEmployeeDto.name;
      existingEmployee.employee_email = updateEmployeeDto.email;
      existingEmployee.employee_password = await bcrypt.hash(updateEmployeeDto.password, 10);
      existingEmployee.employee_role = updateEmployeeDto.role;
      const updatedEmployee = await this.employeeRepository.save(existingEmployee);

      if (updateEmployeeDto.company_id) {
        const updatedCompany = await this.companyRepository.findOne({
          where: { id: updateEmployeeDto.company_id },
          relations: ['employees'],
        });

        if (!updatedCompany) {
          throw new HttpException('Company not found', HttpStatus.BAD_REQUEST);
        }
        existingEmployee.company = updatedCompany;
      }

      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = 'Employee updated successfully';
      response.data = updatedEmployee;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = error.message || 'An error occurred while updating employee';
      response.data = null;
    }
    return response;
  }

  async remove(id: number): Promise<DataResponse<unknown>> {
    const response = new DataResponse();

    try {
      // Find the existing employee by ID
      const employeeToRemove = await this.employeeRepository.findOne({where : {id : id}});

      if (!employeeToRemove) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      // Remove the employee
      await this.employeeRepository.remove(employeeToRemove);

      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = `Employee with ID ${id} removed successfully`;
      response.data = null;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message =
        error.message || `An error occurred while removing employee with ID ${id}`;
      response.data = null;
    }
    return response;
  }

  async isEmailExists(email: string): Promise<boolean> {
    return this.employeeRepository.isEmailExists(email);
  }
  async findByEmail(email: string): Promise<Employee>{
    return this.employeeRepository.findByEmail(email);
  }

}
