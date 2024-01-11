import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpException, UseInterceptors } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ResponseHelper, DataResponse } from '../helper/data-response.helper';
import { Role } from '../../auth/enums/role.enum';
import { Public } from 'src/modules/auth/guards/is-public.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.create(createCompanyDto);
      return ResponseHelper.success(company, 'Company created successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Get()
  @Public()
  async findAll(): Promise<DataResponse<unknown>> {
    try {
      const companies = await this.companyService.findAll();
      return ResponseHelper.success(
        companies,
        'Companies fetched successfully',
      );
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.findOne(+id);
      return ResponseHelper.success(company, 'Company fetched successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.update(+id, updateCompanyDto);
      return ResponseHelper.success(company, 'Company updated successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.remove(+id);
      return ResponseHelper.success(company, 'Company removed successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }
}
