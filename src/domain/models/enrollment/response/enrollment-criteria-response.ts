export class EnrollmentCriteriaResponse {
  id: string = '';
  targetType: string = '';
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;

  constructor(init?: Partial<EnrollmentCriteriaResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): EnrollmentCriteriaResponse {
    return new EnrollmentCriteriaResponse({
      id: json.id,
      targetType: json.targetType,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      targetType: this.targetType,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
