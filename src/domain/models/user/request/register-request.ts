export class RegisterRequestModel {
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  constructor(init?: Partial<RegisterRequestModel>) {
    this.userName = init?.userName ?? '';
    this.password = init?.password ?? '';
    this.confirmPassword = init?.confirmPassword ?? '';
    this.firstName = init?.firstName ?? '';
    this.lastName = init?.lastName ?? '';
    this.phoneNumber = init?.phoneNumber ?? '';
  }

  toJson() {
    return {
      userName: this.userName,
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
    };
  }
}
