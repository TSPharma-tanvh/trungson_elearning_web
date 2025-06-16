export class PermissionResponse {
  name: string;
  value: string;
  groupName: string;
  description?: string;
  type?: string;

  constructor(name: string, value: string, groupName: string, description?: string) {
    this.name = name;
    this.value = value;
    this.groupName = groupName;
    this.description = description;
    this.type = this.extractTypeFromValue(value);
  }

  private extractTypeFromValue(value: string): string | undefined {
    const parts = value.split('.');
    return parts.length > 1 ? parts[1] : undefined;
  }

  static fromJSON(json: any): PermissionResponse {
    return new PermissionResponse(json.name, json.value, json.groupName, json.description);
  }

  toJSON(): any {
    return {
      name: this.name,
      value: this.value,
      groupName: this.groupName,
      description: this.description,
      type: this.type,
    };
  }
}
