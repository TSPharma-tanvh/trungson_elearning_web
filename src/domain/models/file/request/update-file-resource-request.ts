import { type CategoryEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateFileResourcesRequest {
  id!: string; // required
  name?: string;
  status?: StatusEnum;
  categoryID?: string;
  categoryEnum?: CategoryEnum;
  userID?: string;

  classIDs?: string;
  courseIDs?: string;
  lessonIDs?: string;
  quizIDs?: string;
  questionIDs?: string;

  constructor(data?: Partial<UpdateFileResourcesRequest>) {
    Object.assign(this, data);
  }

  static fromJson(json: any): UpdateFileResourcesRequest {
    return new UpdateFileResourcesRequest({
      id: json.id,
      name: json.name,
      status: json.status,
      categoryID: json.categoryID,
      categoryEnum: json.categoryEnum,
      userID: json.userID,
      classIDs: json.classIDs,
      courseIDs: json.courseIDs,
      lessonIDs: json.lessonIDs,
      quizIDs: json.quizIDs,
      questionIDs: json.questionIDs,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      categoryID: this.categoryID,
      categoryEnum: this.categoryEnum,
      userID: this.userID,
      classIDs: this.classIDs,
      courseIDs: this.courseIDs,
      lessonIDs: this.lessonIDs,
      quizIDs: this.quizIDs,
      questionIDs: this.questionIDs,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    formData.append('Id', this.id);

    if (this.name) formData.append('Name', this.name);
    if (this.status !== undefined) formData.append('Status', this.status.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());
    if (this.userID) formData.append('UserID', this.userID);

    if (this.classIDs) formData.append('ClassIDs', this.classIDs);
    if (this.courseIDs) formData.append('CourseIDs', this.courseIDs);
    if (this.lessonIDs) formData.append('LessonIDs', this.lessonIDs);
    if (this.quizIDs) formData.append('QuizIDs', this.quizIDs);
    if (this.questionIDs) formData.append('QuestionIDs', this.questionIDs);

    return formData;
  }
}
