export class UpdateClassTeacherRequest {
  id = '';
  userID?: string;
  description?: string;
  courseID?: string;
  classID?: string;
  status = 'Active'; //active enum

  constructor(init?: Partial<UpdateClassTeacherRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateClassTeacherRequest {
    return new UpdateClassTeacherRequest({
      id: json.id ?? json.Id ?? '',
      userID: json.userID ?? json.UserID,
      description: json.description ?? json.Description,
      courseID: json.courseID ?? json.CourseID,
      classID: json.classID ?? json.ClassID,
      status: json.status ?? json.Status ?? 'Active',
    });
  }

  toJson(): any {
    return {
      Id: this.id,
      UserID: this.userID,
      Description: this.description,
      CourseID: this.courseID,
      ClassID: this.classID,
      Status: this.status,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('Id', this.id);
    if (this.userID) formData.append('UserID', this.userID);
    if (this.description) formData.append('Description', this.description);
    if (this.courseID) formData.append('CourseID', this.courseID);
    if (this.classID) formData.append('ClassID', this.classID);
    formData.append('Status', this.status);
    return formData;
  }
}
