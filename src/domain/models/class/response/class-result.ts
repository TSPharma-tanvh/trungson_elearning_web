import { ClassResponse } from './class-response';

export interface ClassListResult {
  class: ClassResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
