export class GetEnrollmentCriteriaRequest {
  targetType?: string;
  disableStatus?: string;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;
  searchText?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetEnrollmentCriteriaRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetEnrollmentCriteriaRequest {
    return new GetEnrollmentCriteriaRequest({
      targetType: json.targetType,
      disableStatus: json.disableStatus,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      targetType: this.targetType,
      disableStatus: this.disableStatus,
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
