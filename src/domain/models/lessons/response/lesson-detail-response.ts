import { CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { EnrollmentCriteriaResponse } from '@/domain/models/enrollment/response/enrollment-criteria-response';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { QuizLessonResponse } from '@/domain/models/quiz/response/quiz-lesson-response';
import { UserLessonResponse } from '@/domain/models/user-lesson/response/user-lesson-response';

export class LessonDetailResponse {
  id?: string;
  courseID?: string;
  name = '';
  detail?: string;
  enablePlay = false;
  status = '';
  lessonType = '';
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  videoID?: string;
  quizzes?: QuizLessonResponse[];
  userLessonProgress?: UserLessonResponse[];
  enrollmentCriteria?: EnrollmentCriteriaResponse;
  category?: CategoryDetailResponse;
  thumbnail?: FileResourcesResponse;
  video?: FileResourcesResponse;

  constructor(init?: Partial<LessonDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): LessonDetailResponse {
    return new LessonDetailResponse({
      id: json.id,
      courseID: json.courseID,
      name: json.name ?? '',
      detail: json.detail,
      enablePlay: json.enablePlay ?? false,
      status: json.status ?? '',
      lessonType: json.lessonType ?? '',
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      videoID: json.videoID,
      quizzes: json.quizzes?.map((q: any) => QuizLessonResponse.fromJSON(q)),
      userLessonProgress: json.userLessonProgress?.map((u: any) => UserLessonResponse.fromJSON(u)),
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
        : undefined,
      category: json.category ? CategoryDetailResponse.fromJson(json.category) : undefined,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      video: json.video ? FileResourcesResponse.fromJson(json.video) : undefined,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      detail: this.detail,
      enablePlay: this.enablePlay,
      status: this.status,
      lessonType: this.lessonType,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      videoID: this.videoID,
      quizzes: this.quizzes?.map((q) => q.toJSON()),
      userLessonProgress: this.userLessonProgress?.map((u) => u.toJSON()),
      enrollmentCriteria: this.enrollmentCriteria?.toJSON(),
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      video: this.video?.toJson(),
    };
  }
}
