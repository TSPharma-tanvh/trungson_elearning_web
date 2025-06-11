export class AccountFormModel {
  // Add shared fields here if any
}

export class LoginRequest extends AccountFormModel {
  userName: string;
  password: string;

  constructor(userName: string, password: string) {
    super();
    this.userName = userName;
    this.password = password;
  }

  static fromJSON(json: any): LoginRequest {
    return new LoginRequest(json.userName, json.password);
  }

  toJSON(): any {
    return {
      userName: this.userName,
      password: this.password,
    };
  }
}
