export class EnrollmentCriteriaResponse {
  id = '';
  name?: string;
  desc?: string;
  enrollmentCriteriaType = '';
  isDefault = false;
  enrollmentStatus?: string;
  maxCapacity?: number;
  targetLevelID?: string;
  targetPharmacyID?: string;

  constructor(init?: Partial<EnrollmentCriteriaResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaResponse {
    return new EnrollmentCriteriaResponse({
      id: json.id,
      name: json.name,
      desc: json.desc,
      enrollmentCriteriaType: json.enrollmentCriteriaType,
      isDefault: json.isDefault ?? false,
      enrollmentStatus: json.enrollmentStatus,
      maxCapacity: json.maxCapacity,
      targetLevelID: json.targetLevelID,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      isDefault: this.isDefault,
      enrollmentStatus: this.enrollmentStatus,
      maxCapacity: this.maxCapacity,
      targetLevelID: this.targetLevelID,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
