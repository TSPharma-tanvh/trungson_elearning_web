export class UpdateClassTeacherRequest {
  id: string = '';
  userID?: string;
  classType: string = 'Online';
  courseID?: string;
  classID?: string;
  status: string = 'Active';

  constructor(init?: Partial<UpdateClassTeacherRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateClassTeacherRequest {
    return new UpdateClassTeacherRequest({
      id: json.id ?? json.Id ?? '',
      userID: json.userID ?? json.UserID,
      classType: json.classType ?? json.ClassType ?? 'Online',
      courseID: json.courseID ?? json.CourseID,
      classID: json.classID ?? json.ClassID,
      status: json.status ?? json.Status ?? 'Active',
    });
  }

  toJson(): any {
    return {
      Id: this.id,
      UserID: this.userID,
      ClassType: this.classType,
      CourseID: this.courseID,
      ClassID: this.classID,
      Status: this.status,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('Id', this.id);
    if (this.userID) formData.append('UserID', this.userID);
    formData.append('ClassType', this.classType);
    if (this.courseID) formData.append('CourseID', this.courseID);
    if (this.classID) formData.append('ClassID', this.classID);
    formData.append('Status', this.status);
    return formData;
  }
}
