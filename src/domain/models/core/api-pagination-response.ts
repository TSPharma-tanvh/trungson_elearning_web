import { ApiResponse } from './api-response';

export class ApiPaginationResponse<T = any> extends ApiResponse<T> {
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;

  constructor(
    statusCode: number,
    message: string,
    result?: T,
    pageNumber?: number,
    pageSize?: number,
    totalRecords?: number
  ) {
    super(statusCode, message, result);
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
  }

  static fromJson<T>(json: any): ApiPaginationResponse<T> {
    return new ApiPaginationResponse<T>(
      json.statusCode,
      json.message,
      json.result,
      json.pageNumber,
      json.pageSize,
      json.totalRecords
    );
  }

  toJson(): any {
    return {
      statusCode: this.statusCode,
      message: this.message,
      result: this.result,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      totalRecords: this.totalRecords,
    };
  }
}
