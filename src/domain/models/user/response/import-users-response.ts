import { UserImportResponse } from '@/domain/models/user/response/user-import-response';

export class ImportUsersResponse {
  successes: UserImportResponse[] = [];
  errors: string[] = [];

  constructor(init?: Partial<ImportUsersResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ImportUsersResponse {
    return new ImportUsersResponse({
      successes: Array.isArray(json?.successes) ? json.successes.map((x: any) => UserImportResponse.fromJson(x)) : [],
      errors: Array.isArray(json?.errors) ? json.errors : [],
    });
  }

  toJson(): any {
    return {
      successes: this.successes.map((x) => x.toJson()),
      errors: this.errors,
    };
  }
}
