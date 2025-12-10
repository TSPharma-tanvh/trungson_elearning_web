import { DateTimeUtils } from '@/utils/date-time-utils';

export class GetUserDevicesRequest {
  userID?: string;
  deviceName?: string;
  deviceType?: string;
  deviceID?: string;
  deviceToken?: string;
  ipAddress?: string;
  signInAtFrom?: Date;
  signInAtTo?: Date;
  signOutAtFrom?: Date;
  signOutAtTo?: Date;
  lastAccessFrom?: Date;
  lastAccessTo?: Date;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserDevicesRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserDevicesRequest {
    return new GetUserDevicesRequest({
      userID: json.userID,
      deviceName: json.deviceName,
      deviceType: json.deviceType,
      deviceID: json.deviceID,
      deviceToken: json.deviceToken,
      ipAddress: json.ipAddress,
      signInAtFrom: json.signInAtFrom ? new Date(json.signInAtFrom) : undefined,
      signInAtTo: json.signInAtTo ? new Date(json.signInAtTo) : undefined,
      signOutAtFrom: json.signOutAtFrom ? new Date(json.signOutAtFrom) : undefined,
      signOutAtTo: json.signOutAtTo ? new Date(json.signOutAtTo) : undefined,
      lastAccessFrom: json.lastAccessFrom ? new Date(json.lastAccessFrom) : undefined,
      lastAccessTo: json.lastAccessTo ? new Date(json.lastAccessTo) : undefined,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      userID: this.userID,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      deviceID: this.deviceID,
      deviceToken: this.deviceToken,
      ipAddress: this.ipAddress,
      signInAtFrom: this.signInAtFrom ? DateTimeUtils.formatISODateToString(this.signInAtFrom) : undefined,
      signInAtTo: this.signInAtTo ? DateTimeUtils.formatISODateToString(this.signInAtTo) : undefined,
      signOutAtFrom: this.signOutAtFrom ? DateTimeUtils.formatISODateToString(this.signOutAtFrom) : undefined,
      signOutAtTo: this.signOutAtTo ? DateTimeUtils.formatISODateToString(this.signOutAtTo) : undefined,
      lastAccessFrom: this.lastAccessFrom ? DateTimeUtils.formatISODateToString(this.lastAccessFrom) : undefined,
      lastAccessTo: this.lastAccessTo ? DateTimeUtils.formatISODateToString(this.lastAccessTo) : undefined,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
