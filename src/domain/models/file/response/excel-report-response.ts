export class ExcelReportResponse {
  fileName!: string;
  contentType!: string;
  base64!: string;

  constructor(init?: Partial<ExcelReportResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ExcelReportResponse {
    if (!json) return new ExcelReportResponse();
    return new ExcelReportResponse({
      fileName: json.fileName,
      contentType: json.contentType,
      base64: json.base64,
    });
  }

  toJson(): any {
    return {
      fileName: this.fileName,
      contentType: this.contentType,
      base64: this.base64,
    };
  }
}
