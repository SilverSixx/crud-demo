export class DataResponse<T> {
  message: string;
  statusCode: number;
  isError: boolean;
  data: T;
}
