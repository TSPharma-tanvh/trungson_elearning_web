export class ApiResponse<T = any> {
  statusCode: number;
  message: string;
  result?: T;

  constructor(statusCode: number, message: string, result?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }

  get isSuccessStatusCode(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  static fromJSON<T>(json: any): ApiResponse<T> {
    return new ApiResponse<T>(json.statusCode, json.message, json.result);
  }

  toJSON(): any {
    return {
      statusCode: this.statusCode,
      message: this.message,
      result: this.result,
    };
  }
}
