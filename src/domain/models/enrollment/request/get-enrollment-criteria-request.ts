import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';

export class GetEnrollmentCriteriaRequest {
  targetType?: CategoryEnum;
  disableStatus?: StatusEnum;
  isDefault?: boolean;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(data: Partial<GetEnrollmentCriteriaRequest> = {}) {
    Object.assign(this, {
      targetType: data.targetType,
      disableStatus: data.disableStatus,
      isDefault: data.isDefault,
      targetID: data.targetID,
      targetLevelID: data.targetLevelID,
      maxCapacity: data.maxCapacity,
      targetPharmacyID: data.targetPharmacyID,
      searchText: data.searchText,
      pageNumber: data.pageNumber ?? 1,
      pageSize: data.pageSize ?? 10,
    });
  }

  static fromJson(json: any): GetEnrollmentCriteriaRequest {
    return new GetEnrollmentCriteriaRequest({
      targetType: json.targetType ? CategoryEnum[json.targetType as keyof typeof CategoryEnum] : undefined,
      disableStatus: json.disableStatus ? StatusEnum[json.disableStatus as keyof typeof StatusEnum] : undefined,
      isDefault: json.isDefault,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
      searchText: json.searchText,
      pageNumber: json.pageNumber,
      pageSize: json.pageSize,
    });
  }

  toJson(): any {
    return {
      targetType: this.targetType,
      disableStatus: this.disableStatus,
      isDefault: this.isDefault,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
