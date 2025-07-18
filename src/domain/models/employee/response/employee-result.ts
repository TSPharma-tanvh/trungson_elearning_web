import { EmployeeResponse } from './employee-response';

export interface EmployeeListResult {
  employees: EmployeeResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
