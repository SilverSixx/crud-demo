import { IsNotEmpty } from 'class-validator';
export class DataResponse<T> {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  statusCode: number;
  @IsNotEmpty()
  isError: boolean;
  @IsNotEmpty()
  data: T;
}
