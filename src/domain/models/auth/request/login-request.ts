export class LoginRequest {
  userName: string;
  password: string;

  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }

  static fromJson(json: any): LoginRequest {
    return new LoginRequest(json.userName, json.password);
  }

  toJson(): any {
    return {
      userName: this.userName,
      password: this.password,
    };
  }
}
