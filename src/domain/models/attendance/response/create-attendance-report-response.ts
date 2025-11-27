export class CreateAttendanceReportResponse {
  fileName!: string;
  contentType!: string;
  base64!: string;

  constructor(init?: Partial<CreateAttendanceReportResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateAttendanceReportResponse {
    if (!json) return new CreateAttendanceReportResponse();
    return new CreateAttendanceReportResponse({
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
