export class CreateClassTeacherRequest {
  userID?: string;
  description?: string;
  courseID?: string;
  classID?: string;
  status = 'Active';

  constructor(init?: Partial<CreateClassTeacherRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateClassTeacherRequest {
    return new CreateClassTeacherRequest({
      userID: json.userID ?? json.UserID,
      description: json.description ?? json.Description,
      courseID: json.courseID ?? json.CourseID,
      classID: json.classID ?? json.ClassID,
      status: json.status ?? json.Status ?? 'Active',
    });
  }

  toJson(): any {
    return {
      UserID: this.userID,
      Description: this.description,
      CourseID: this.courseID,
      ClassID: this.classID,
      Status: this.status,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    if (this.userID) formData.append('UserID', this.userID);
    if (this.description) formData.append('Description', this.description);
    if (this.courseID) formData.append('CourseID', this.courseID);
    if (this.classID) formData.append('ClassID', this.classID);
    formData.append('Status', this.status);
    return formData;
  }
}
