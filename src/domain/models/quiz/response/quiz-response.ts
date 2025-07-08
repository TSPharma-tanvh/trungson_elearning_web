import { QuizTypeEnum } from '@/utils/enum/core-enum';

import { AttendanceRecordResponse } from '../../attendance/response/attendance-record-response';
import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileQuizRelationResponse } from '../../file/response/file-quiz-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { QuestionResponse } from '../../question/response/question-response';
import { UserAnswerResponse } from '../../user-answer/response/user-answer-response';
import { UserQuizProgressionResponse } from '../../user-quiz/response/user-quiz-progress-response';
import { QuizLessonResponse } from './quiz-lesson-response';

export class QuizResponse {
  id?: string;
  title?: string;
  description?: string;
  status: string = '';

  startTime?: Date;
  endTime?: Date;
  totalScore?: number;

  thumbnail?: FileResourcesResponse;
  thumbnailID?: string;

  quizQuestions: QuestionResponse[] = [];

  enrollmentCriteria?: EnrollmentCriteriaResponse[];

  fileQuizRelation?: FileQuizRelationResponse[];
  lessonID?: string;
  levelID?: string;
  lesson?: QuizLessonResponse;
  categoryID?: string;
  category?: CategoryResponse;
  userQuizProgress?: UserQuizProgressionResponse[];
  userAnswer?: UserAnswerResponse[];
  attendanceRecords?: AttendanceRecordResponse[];
  canStartOver?: boolean;
  canShuffle?: boolean;
  isRequired?: boolean;
  isAutoSubmitted?: boolean;
  type?: QuizTypeEnum;
  time?: string; // backend sends “hh:mm:ss”; keep as string or parse to seconds
  scoreToPass?: number;
  totalQuestion?: number;
  maxAttempts?: number;

  constructor(init?: Partial<QuizResponse>) {
    Object.assign(this, init);
  }

  /** ① map raw JSON -> class */
  static fromJSON(json: any): QuizResponse {
    const dto = new QuizResponse();

    dto.id = json.id;
    dto.title = json.title;
    dto.description = json.description;
    dto.status = json.status ?? '';

    dto.startTime = json.startTime ? new Date(json.startTime) : undefined;
    dto.endTime = json.endTime ? new Date(json.endTime) : undefined;
    dto.totalScore = json.totalScore;

    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.thumbnailID = json.thumbnailID;

    dto.quizQuestions = Array.isArray(json.quizQuestions)
      ? json.quizQuestions.map((q: any) => QuestionResponse.fromJSON(q))
      : [];

    dto.enrollmentCriteria = Array.isArray(json.enrollmentCriteria)
      ? json.enrollmentCriteria.map((e: any) => EnrollmentCriteriaResponse.fromJSON(e))
      : undefined;

    dto.fileQuizRelation = Array.isArray(json.fileQuizRelation)
      ? json.fileQuizRelation.map((f: any) => FileQuizRelationResponse.fromJSON(f))
      : undefined;

    dto.lessonID = json.lessonID;
    dto.levelID = json.levelID;
    dto.lesson = json.lesson ? QuizLessonResponse.fromJSON(json.lesson) : undefined;

    dto.categoryID = json.categoryID;
    dto.category = json.category ? CategoryResponse.fromJSON(json.category) : undefined;

    dto.userQuizProgress = Array.isArray(json.userQuizProgress)
      ? json.userQuizProgress.map((p: any) => UserQuizProgressionResponse.fromJSON(p))
      : undefined;

    dto.userAnswer = Array.isArray(json.userAnswer)
      ? json.userAnswer.map((a: any) => UserAnswerResponse.fromJSON(a))
      : undefined;

    dto.attendanceRecords = Array.isArray(json.attendanceRecords)
      ? json.attendanceRecords.map((r: any) => AttendanceRecordResponse.fromJson(r))
      : undefined;

    dto.canStartOver = json.canStartOver ?? false;
    dto.canShuffle = json.canShuffle ?? false;
    dto.isRequired = json.isRequired ?? false;
    dto.isAutoSubmitted = json.isAutoSubmitted ?? true;

    dto.type = json.type ?? 'LessonQuiz';
    dto.time = json.time;
    dto.scoreToPass = json.scoreToPass;
    dto.totalQuestion = json.totalQuestion;
    dto.maxAttempts = json.maxAttempts;

    return dto;
  }

  /** ② map class -> JSON ready for API */
  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,

      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      totalScore: this.totalScore,

      thumbnail: this.thumbnail?.toJson?.() ?? this.thumbnail,
      thumbnailID: this.thumbnailID,

      quizQuestions: this.quizQuestions.map((q) => (q.toJSON ? q.toJSON() : q)),
      enrollmentCriteria: this.enrollmentCriteria?.map((e) => (e.toJSON ? e.toJSON() : e)),

      fileQuizRelation: this.fileQuizRelation?.map((f) => (f.toJSON ? f.toJSON() : f)),

      lessonID: this.lessonID,
      levelID: this.levelID,
      lesson: this.lesson?.toJSON?.() ?? this.lesson,

      categoryID: this.categoryID,
      category: this.category?.toJSON?.() ?? this.category,

      userQuizProgress: this.userQuizProgress?.map((p) => (p.toJSON ? p.toJSON() : p)),
      userAnswer: this.userAnswer?.map((a) => (a.toJSON ? a.toJSON() : a)),
      attendanceRecords: this.attendanceRecords?.map((r) => (r.toJson ? r.toJson() : r)),

      canStartOver: this.canStartOver,
      canShuffle: this.canShuffle,
      isRequired: this.isRequired,
      isAutoSubmitted: this.isAutoSubmitted,

      type: this.type,
      time: this.time, // stay consistent with backend “hh:mm:ss”
      scoreToPass: this.scoreToPass,
      totalQuestion: this.totalQuestion,
      maxAttempts: this.maxAttempts,
    };
  }
}
