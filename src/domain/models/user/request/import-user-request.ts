export class CreateUsersFromExcelRequest {
  excelFile?: File;
  id?: string;

  constructor(init?: Partial<CreateUsersFromExcelRequest>) {
    Object.assign(this, init);
  }

  toFormData(): FormData {
    const form = new FormData();
    if (this.excelFile) form.append('excelFile', this.excelFile);
    if (this.id) form.append('id', this.id);
    return form;
  }
}
