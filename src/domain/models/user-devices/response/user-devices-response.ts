import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserDeviceResponse {
  id!: string;
  userID?: string;
  deviceName?: string;
  deviceType?: string;
  deviceID?: string;
  deviceToken?: string;
  ipAddress?: string;
  signInAt?: Date;
  signOutAt?: Date;
  lastAccess?: Date;
  user?: UserDetailResponse;

  constructor(init?: Partial<UserDeviceResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserDeviceResponse {
    return new UserDeviceResponse({
      id: json.id,
      userID: json.userID,
      deviceName: json.deviceName,
      deviceType: json.deviceType,
      deviceID: json.deviceID,
      deviceToken: json.deviceToken,
      ipAddress: json.ipAddress,
      signInAt: json.signInAt ? new Date(json.signInAt) : undefined,
      signOutAt: json.signOutAt ? new Date(json.signOutAt) : undefined,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      user: json.user ? UserDetailResponse.fromJson(json.user) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      deviceID: this.deviceID,
      deviceToken: this.deviceToken,
      ipAddress: this.ipAddress,
      signInAt: this.signInAt?.toISOString(),
      signOutAt: this.signOutAt?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      user: this.user?.toJson(),
    };
  }
}
