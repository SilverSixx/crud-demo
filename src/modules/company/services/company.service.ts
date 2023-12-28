import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from '../repos/company.repo';
import { Company } from '../entities/company.entity';
import { EmployeeRepository } from '../../employee/repo/employee.repo';
import { In } from 'typeorm';
import { DataResponse } from '../dto/data-response.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
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
      response.statusCode = HttpStatus.CREATED;
      response.isError = false;
      response.message = 'Company created successfully';
      response.data = await this.companyRepository.save(newCompany);
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      response.message = error.message || 'An error occurred while creating company';
      response.data = null;
    }
    return response;
  }

  async findAll(): Promise<DataResponse<Company[]>> {
    const response = new DataResponse<Company[]>();
    try {
      const companiesWithEmployees = await this.companyRepository.find({
        relations: ['employees'],
      });
      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = 'Companies with theirs employees retrieved successfully';
      response.data = companiesWithEmployees;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = 'An error occurred while retrieving companies with employees';
      response.data = null;
    }
    return response;
  }

  async findOne(id: number): Promise<DataResponse<Company>> {
    const response = new DataResponse<Company>();
    try {
      const company = await this.companyRepository.findOne({
        where: { id: id },
        relations: ['employees'],
      });
      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = 'Company with its employees retrieved successfully';
      response.data = company;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = 'An error occurred while retrieving company with employees';
      response.data = null;
    }
    return response;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<DataResponse<unknown>> {
    const response = new DataResponse();
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

      const updatedCompany = await this.companyRepository.save(existingCompany);

      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = 'Company updated successfully';
      response.data = updatedCompany;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = error.message || 'An error occurred while updating company';
      response.data = null;
    }

    return response;
  }

  async remove(id: number): Promise<DataResponse<unknown>> {
    const response = new DataResponse();

    try {
      const companyToRemove = await this.companyRepository.findOne({
        where: { id: id },
        relations: ['employees'],
      });

      if (!companyToRemove) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      // Remove associated employees
      if (companyToRemove.employees && companyToRemove.employees.length > 0) {
        for (const employee of companyToRemove.employees) {
          await this.employeeRepository.remove(employee);
        }
      }
      await this.companyRepository.remove(companyToRemove);

      response.statusCode = HttpStatus.OK;
      response.isError = false;
      response.message = `Company with ID ${id} and its associated employees removed successfully`;
      response.data = null;
    } catch (error) {
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.isError = true;
      response.message = error.message || `An error occurred while removing company with ID ${id}`;
      response.data = null;
    }

    return response;
  }
}
