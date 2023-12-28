import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  employee_ids: number[];
}
