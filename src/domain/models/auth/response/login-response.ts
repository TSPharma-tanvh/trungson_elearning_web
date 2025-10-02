export class LoginResponse {
  token: string;
  refreshToken: string;
  userId: string;

  constructor(token: string, refreshToken: string, userId: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }

  static fromJson(json: any): LoginResponse {
    return new LoginResponse(json.token, json.refreshToken, json.userId);
  }

  toJson(): any {
    return {
      token: this.token,
      refreshToken: this.refreshToken,
      userId: this.userId,
    };
  }
}
