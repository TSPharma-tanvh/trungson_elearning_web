import { type AttendanceRecordDetailResponse } from './attendance-record-detail-response';

export interface AttendanceRecordsListResult {
  records: AttendanceRecordDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
