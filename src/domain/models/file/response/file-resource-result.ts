import { type FileResourcesResponse } from "./file-resources-response";

export interface FileResourceListResult {
  files: FileResourcesResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
