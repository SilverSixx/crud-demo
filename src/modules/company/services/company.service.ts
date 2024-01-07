import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from '../repos/company.repo';
import { Company } from '../entities/company.entity';
import { EmployeeRepository } from '../../employee/repo/employee.repo';
import { In } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<object> {
    try {
      const employees = await this.employeeRepository.find({
        where: { id: In(createCompanyDto.employee_ids) },
      });
      if (employees.length !== createCompanyDto.employee_ids.length) {
        throw new HttpException('One or more employee IDs not found in the database.', HttpStatus.BAD_REQUEST);
      }
      const newCompany = new Company();
      newCompany.name = createCompanyDto.company_name;
      newCompany.employees = employees;
      return await this.companyRepository.save(newCompany);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(): Promise<object[]> {
    try {
      return await this.companyRepository.find({
        relations: ['employees'],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: id },
        relations: ['employees'],
      });
      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      return company;
    } catch (error) {
      console.error(error);
      throw error;
    }
  
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<object> {
    try {
      const existingCompany = await this.companyRepository.findOne({
        where: { id: id },
        relations: ['employees'],
      });

      if (!existingCompany) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      const employees = await this.employeeRepository.find({
        where: { id: In(updateCompanyDto.employee_ids) },
      });

      if (employees.length !== updateCompanyDto.employee_ids.length) {
        throw new HttpException('One or more employee IDs not found in the database.', HttpStatus.BAD_REQUEST);
      }

      existingCompany.name = updateCompanyDto.company_name;
      existingCompany.employees = employees;

      return await this.companyRepository.save(existingCompany);

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const companyToRemove = await this.companyRepository.findOne({
        where: { id: id },
        relations: ['employees'],
      });

      if (!companyToRemove) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      if (companyToRemove.employees && companyToRemove.employees.length > 0) {
        for (const employee of companyToRemove.employees) {
          await this.employeeRepository.remove(employee);
        }
      }
      return await this.companyRepository.remove(companyToRemove);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
