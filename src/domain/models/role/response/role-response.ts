export class RoleResponse {
  id?: string;
  name: string;
  permissions: string[];

  constructor(init?: Partial<RoleResponse>) {
    this.name = init?.name ?? '';
    this.permissions = init?.permissions ?? [];
    if (init?.id) this.id = init.id;
  }

  static fromJSON(json: any): RoleResponse {
    return new RoleResponse({
      id: json?.id,
      name: json?.name ?? '',
      permissions: Array.isArray(json?.permissions) ? json.permissions : [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
    };
  }
}
