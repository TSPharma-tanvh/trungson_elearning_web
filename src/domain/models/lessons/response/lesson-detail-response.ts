import { CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { EnrollmentCriteriaResponse } from '@/domain/models/enrollment/response/enrollment-criteria-response';
import { FileLessonRelationResponse } from '@/domain/models/file/response/file-lesson-relation-response';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { QuizLessonResponse } from '@/domain/models/quiz/response/quiz-lesson-response';
import { UserLessonResponse } from '@/domain/models/user-lesson/response/user-lesson-response';

import { CourseDetailResponse } from '../../courses/response/course-detail-response';

export class LessonDetailResponse {
  id = '';
  courseID?: string;
  name = '';
  detail?: string;
  enablePlay = false;
  status = '';
  lessonType = '';
  contentType?: string;
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
  isRequired?: boolean;
  course?: CourseDetailResponse;
  fileLessonRelation?: FileLessonRelationResponse[];

  constructor(init?: Partial<LessonDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): LessonDetailResponse {
    return new LessonDetailResponse({
      id: json.id,
      courseID: json.courseID,
      name: json.name ?? '',
      detail: json.detail,
      enablePlay: json.enablePlay ?? false,
      status: json.status ?? '',
      lessonType: json.lessonType ?? '',
      contentType: json.contentType,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      videoID: json.videoID,
      quizzes: json.quizzes?.map((q: any) => QuizLessonResponse.fromJson(q)),
      userLessonProgress: json.userLessonProgress?.map((u: any) => UserLessonResponse.fromJson(u)),
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
      category: json.category ? CategoryDetailResponse.fromJson(json.category) : undefined,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      video: json.video ? FileResourcesResponse.fromJson(json.video) : undefined,
      isRequired: json.isRequired,
      course: json.course ? CourseDetailResponse.fromJson(json.course) : undefined,
      fileLessonRelation: json.fileLessonRelation?.map((f: any) => FileLessonRelationResponse.fromJson(f)), // 🔹 map field mới
    });
  }

  toJson(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      detail: this.detail,
      enablePlay: this.enablePlay,
      status: this.status,
      lessonType: this.lessonType,
      contentType: this.contentType,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      videoID: this.videoID,
      quizzes: this.quizzes?.map((q) => q.toJson()),
      userLessonProgress: this.userLessonProgress?.map((u) => u.toJson()),
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      video: this.video?.toJson(),
      isRequired: this.isRequired,
      course: this.course?.toJson(),
      fileLessonRelation: this.fileLessonRelation?.map((f) => f.toJson()), // 🔹 serialize
    };
  }
}
