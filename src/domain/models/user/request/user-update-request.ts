export class UpdateUserInfoRequest {
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  levelID?: string;
  roles?: string;
  employeeId?: string;
  thumbnailID?: string;
  thumbnail?: File | null;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;

  constructor(data?: Partial<UpdateUserInfoRequest>) {
    if (data) {
      this.userName = data.userName;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.isActive = data.isActive;
      this.levelID = data.levelID;
      this.roles = data.roles;
      this.employeeId = data.employeeId;
      this.thumbnailID = data.thumbnailID;
      this.thumbnail = data.thumbnail ?? null;
      this.thumbDocumentNo = data.thumbDocumentNo;
      this.thumbPrefixName = data.thumbPrefixName;
      this.isDeleteOldThumbnail = data.isDeleteOldThumbnail;
    }
  }

  static fromJSON(json: any): UpdateUserInfoRequest {
    return new UpdateUserInfoRequest({
      userName: json.userName,
      email: json.email,
      firstName: json.firstName,
      lastName: json.lastName,
      isActive: json.isActive,
      levelID: json.levelID,
      roles: json.roles,
      employeeId: json.employeeId,
      thumbnailID: json.thumbnailID,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
    });
  }

  toJSON(): any {
    return {
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      levelID: this.levelID,
      roles: this.roles,
      employeeId: this.employeeId,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    if (this.userName) formData.append('UserName', this.userName);
    if (this.email) formData.append('Email', this.email);
    if (this.firstName) formData.append('FirstName', this.firstName);
    if (this.lastName) formData.append('LastName', this.lastName);
    if (this.isActive !== undefined) formData.append('IsActive', String(this.isActive));
    if (this.levelID) formData.append('LevelID', this.levelID);
    if (this.roles) formData.append('Roles', this.roles);
    if (this.employeeId) formData.append('EmployeeId', this.employeeId);
    if (this.thumbnailID) formData.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined) {
      formData.append('IsDeleteOldThumbnail', String(this.isDeleteOldThumbnail));
    }
    return formData;
  }
}
