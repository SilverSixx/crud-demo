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
    private readonly employeeRepository: EmployeeRepository
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
      response.message = 'Employee created successfully';
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

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
