import { UserImportResponse } from '@/domain/models/user/response/user-import-response';

export class ImportUsersResponse {
  successes: UserImportResponse[] = [];
  errors: string[] = [];

  constructor(init?: Partial<ImportUsersResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): ImportUsersResponse {
    return new ImportUsersResponse({
      successes: Array.isArray(json?.successes) ? json.successes.map((x: any) => UserImportResponse.fromJSON(x)) : [],
      errors: Array.isArray(json?.errors) ? json.errors : [],
    });
  }

  toJSON(): any {
    return {
      successes: this.successes.map((x) => x.toJSON()),
      errors: this.errors,
    };
  }
}
