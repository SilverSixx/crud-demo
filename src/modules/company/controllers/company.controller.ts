import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ResponseHelper, DataResponse } from '../helper/data-response.helper';
import { HttpExceptionHandler } from '../helper/ex-response.handler';
import { Role } from '../../auth/enums/role.enum';
import { Public } from 'src/modules/auth/guards/is-public.decorator';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Create new company' })
  @ApiBody({
    type: CreateCompanyDto,
    description: 'Needed infos to create a new company',
  })
  @ApiResponse({
    status: 201,
    description:
      'Return a standard json message object that shows successful creation of the company',
    type: DataResponse<unknown>,
  })
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
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({
    summary: 'Fetch all companies',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful fetch of the companies with its all related employees',
    type: DataResponse<unknown>,
  })
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
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({
    summary: 'Fetch 1 specific company',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to fetch',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful fetch of the company with its all related employees',
    type: DataResponse<unknown>,
  })
  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.findOne(+id);
      return ResponseHelper.success(company, 'Company fetched successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({ summary: 'Update company' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to update',
    type: Number,
  })
  @ApiBody({
    type: UpdateCompanyDto,
    description: 'Needed infos to update a company',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful update of the company',
    type: DataResponse<unknown>,
  })
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
      return HttpExceptionHandler.handle(error);
    }
  }

  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Return a standard json message object that shows successful deletion of the company',
    type: DataResponse<unknown>,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<DataResponse<unknown>> {
    try {
      const company = await this.companyService.remove(+id);
      return ResponseHelper.success(company, 'Company deleted successfully');
    } catch (error) {
      return HttpExceptionHandler.handle(error);
    }
  }
}
