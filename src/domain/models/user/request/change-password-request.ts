export class ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;

  constructor(init?: Partial<ChangePasswordRequest>) {
    this.userId = init?.userId ?? '';
    this.oldPassword = init?.oldPassword ?? '';
    this.newPassword = init?.newPassword ?? '';
    this.passwordConfirm = init?.passwordConfirm ?? '';
  }

  static fromJson(json: any): ChangePasswordRequest {
    return new ChangePasswordRequest({
      userId: json.userId,
      oldPassword: json.oldPassword,
      newPassword: json.newPassword,
      passwordConfirm: json.passwordConfirm,
    });
  }

  toJson(): any {
    return {
      userId: this.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      passwordConfirm: this.passwordConfirm,
    };
  }
}
