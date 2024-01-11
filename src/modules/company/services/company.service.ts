import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from '../repos/company.repo';
import { Company } from '../entities/company.entity';
import { EmployeeRepository } from '../../employee/repo/employee.repo';
import { In } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<object> {
    try {
      const employees = await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.id IN (:...ids)', {
          ids: createCompanyDto.employee_ids,
        })
        .getMany();
      if (employees.length !== createCompanyDto.employee_ids.length) {
        throw new HttpException(
          'One or more employee IDs not found in the database.',
          HttpStatus.BAD_REQUEST,
        );
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

  async findAll(): Promise<unknown> {
    try {
      console.log('this should be logged once when turn on the CacheInterceptor');
      const cacheKey = 'all_companies';
      let cachedData = await this.cacheManager.get(cacheKey);
      if (!cachedData) {
        const companies = await this.companyRepository
          .createQueryBuilder('company')
          .leftJoinAndSelect('company.employees', 'employee')
          .getMany();
        await this.cacheManager.set(cacheKey, companies);
        return companies;
      }
      return cachedData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<unknown> {
    try {
      const cacheKey = `company_${id}`;
      let cachedCompany = await this.cacheManager.get(cacheKey);
      if (!cachedCompany) {
        const company = await this.companyRepository
          .createQueryBuilder('company')
          .leftJoinAndSelect('company.employees', 'employee')
          .where('company.id = :id', { id })
          .getOne();
        if (!company) {
          throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
        }
        await this.cacheManager.set(cacheKey, company);
        cachedCompany = company;
      }
      return cachedCompany;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<object> {
    try {
      const existingCompany = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.employees', 'employee')
        .where('company.id = :id', { id })
        .getOne();

      if (!existingCompany) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      const employees = await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.id IN (:...ids)', {
          ids: updateCompanyDto.employee_ids,
        })
        .getMany();

      if (employees.length !== updateCompanyDto.employee_ids.length) {
        throw new HttpException(
          'One or more employee IDs not found in the database.',
          HttpStatus.BAD_REQUEST,
        );
      }

      existingCompany.name = updateCompanyDto.company_name;
      existingCompany.employees = employees;

      const updatedCompany = await this.companyRepository.save(existingCompany);

      // invalidate the cache (if exists)
      const cacheKey = `company_${id}`;
      const isCacheEntryExists = await this.cacheManager.get(cacheKey);
      if (isCacheEntryExists) {
        await this.cacheManager.del(cacheKey);
      }

      return updatedCompany;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const companyToRemove = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.employees', 'employee')
        .where('company.id = :id', { id })
        .getOne();

      if (!companyToRemove) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      if (companyToRemove.employees && companyToRemove.employees.length > 0) {
        for (const employee of companyToRemove.employees) {
          await this.employeeRepository.remove(employee);
        }
      }
      const delCompany = await this.companyRepository.remove(companyToRemove);

      const cacheKey = `company_${id}`;
      const isCacheEntryExists = await this.cacheManager.get(cacheKey);
      if (isCacheEntryExists) {
        await this.cacheManager.del(cacheKey);
      }

      return delCompany;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
