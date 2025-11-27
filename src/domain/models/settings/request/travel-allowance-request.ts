export class TravelAllowanceRequest {
  distanceFromKm: number;
  distanceToKm: number;
  allowanceAmount: number;

  constructor(init?: Partial<TravelAllowanceRequest>) {
    this.distanceFromKm = init?.distanceFromKm ?? 0;
    this.distanceToKm = init?.distanceToKm ?? 0;
    this.allowanceAmount = init?.allowanceAmount ?? 0;
  }

  static fromJson(json: any): TravelAllowanceRequest {
    if (!json) return new TravelAllowanceRequest();

    return new TravelAllowanceRequest({
      distanceFromKm: json.distanceFromKm ?? json.DistanceFromKm ?? 0,
      distanceToKm: json.distanceToKm ?? json.DistanceToKm ?? 0,
      allowanceAmount: json.allowanceAmount ?? json.AllowanceAmount ?? 0,
    });
  }

  toJson(): any {
    return {
      DistanceFromKm: this.distanceFromKm,
      DistanceToKm: this.distanceToKm,
      AllowanceAmount: this.allowanceAmount,
    };
  }
}
