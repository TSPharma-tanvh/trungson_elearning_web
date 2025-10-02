export class RoleResponse {
  id?: string;
  name: string;
  description: string;
  permissions: string[];

  constructor(init?: Partial<RoleResponse>) {
    this.name = init?.name ?? '';
    this.description = init?.description ?? '';
    this.permissions = init?.permissions ?? [];
    if (init?.id) this.id = init.id;
  }

  static fromJson(json: any): RoleResponse {
    return new RoleResponse({
      id: json?.id,
      name: json?.name ?? '',
      description: json?.description ?? '',
      permissions: Array.isArray(json?.permissions) ? json.permissions : [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions,
    };
  }
}
