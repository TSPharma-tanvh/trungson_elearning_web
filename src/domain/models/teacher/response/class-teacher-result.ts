import { type ClassTeacherResponse } from './class-teacher-response';

export interface ClassTeacherListResult {
  teachers: ClassTeacherResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
