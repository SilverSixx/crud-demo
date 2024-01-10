import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpException, UseInterceptors } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TokenGuard } from '../../auth/guards/token.guard';
import { ResponseHelper, DataResponse } from '../helper/data-response.helper';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles('admin')
  @UseGuards(TokenGuard, AdminGuard)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.create(createCompanyDto);
      return ResponseHelper.success(
        company,
        'Company created successfully',
      );
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Get()
  @UseGuards(TokenGuard)
  async findAll(): Promise<DataResponse<unknown>> {
    try {
      const companies = await this.companyService.findAll();
      return ResponseHelper.success(companies, 'Companies fetched successfully');
    } catch (error) {
      return ResponseHelper.error(
        error instanceof HttpException ? error.getStatus() : 500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error.message || 'Internal Server Error',
      );
    }
  }

  @Get(':id')
  @UseGuards(TokenGuard)
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
  @Roles('admin')
  @UseGuards(TokenGuard,AdminGuard)
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
  @Roles('admin')
  @UseGuards(TokenGuard, AdminGuard)
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
