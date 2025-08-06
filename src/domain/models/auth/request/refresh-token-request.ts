export class RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static fromJson(json: any): RefreshTokenRequest {
    return new RefreshTokenRequest(json.accessToken ?? '', json.refreshToken ?? '');
  }

  toJson(): any {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
}
