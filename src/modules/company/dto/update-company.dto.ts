import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsInt } from 'class-validator';
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsInt()
  id: number
}
