export class UpdateUserDevicesRequest {
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

  constructor(init?: Partial<UpdateUserDevicesRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateUserDevicesRequest {
    return new UpdateUserDevicesRequest({
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
    };
  }
}
