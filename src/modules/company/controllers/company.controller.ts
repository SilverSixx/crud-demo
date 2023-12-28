import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TokenGuard } from '../../auth/guards/token.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @UseGuards(TokenGuard)
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(TokenGuard)
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
