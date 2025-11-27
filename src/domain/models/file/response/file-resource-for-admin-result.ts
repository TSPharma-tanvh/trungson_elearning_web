import { type FileResourcesResponseForAdmin } from './file-resources-for-admin-response';

export interface FileResourceListForAdminResult {
  files: FileResourcesResponseForAdmin[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
