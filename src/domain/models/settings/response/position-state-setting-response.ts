export class PositionStateSettingResponse {
  id?: number;
  code?: string;
  name?: string;
  order!: number;
  isActive?: number;

  constructor(init?: Partial<PositionStateSettingResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): PositionStateSettingResponse {
    return new PositionStateSettingResponse({
      id: json.Id ?? json.id,
      code: json.Code ?? json.code,
      name: json.Name ?? json.name,
      order: json.Order ?? json.order,
      isActive: json.IsActive ?? json.isActive,
    });
  }

  static parseArray(jsonStr: string): PositionStateSettingResponse[] {
    try {
      const arr = JSON.parse(jsonStr);
      if (!Array.isArray(arr)) return [];
      return arr.map((x) => PositionStateSettingResponse.fromJson(x));
    } catch (err) {
      return [];
    }
  }

  static sortByOrder(items: PositionStateSettingResponse[]): PositionStateSettingResponse[] {
    return [...items].sort((a, b) => a.order - b.order);
  }
}
