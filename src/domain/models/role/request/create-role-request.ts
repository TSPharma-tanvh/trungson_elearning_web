export class CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;

  constructor(init?: Partial<CreateRoleRequest>) {
    this.name = init?.name ?? '';
    this.description = init?.description;
    this.permissions = init?.permissions ?? [];
    this.isActive = init?.isActive ?? true;
  }

  static fromJson(json: any): CreateRoleRequest {
    return new CreateRoleRequest({
      name: json.name,
      description: json.description,
      permissions: json.permissions ?? [],
      isActive: json.isActive ?? true,
    });
  }

  toJson(): any {
    return {
      name: this.name,
      description: this.description,
      permissions: this.permissions,
      isActive: this.isActive,
    };
  }
}
