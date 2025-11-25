import { type QuizTypeEnum } from '@/utils/enum/core-enum';

import { AttendanceRecordResponse } from '../../attendance/response/attendance-record-response';
import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { QuizEnrollmentCriteriaRelationResponse } from '../../criteria/response/quiz-enrollment-criteria-relation-response';
import { FileQuizRelationResponse } from '../../file/response/file-quiz-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { UserQuizQuestionResponse } from '../../question/response/user-quiz-question-response';
import { UserAnswerResponse } from '../../user-answer/response/user-answer-response';
import { UserQuizProgressionResponse } from '../../user-quiz/response/user-quiz-progress-response';
import { QuizLessonResponse } from './quiz-lesson-response';

export class QuizResponse {
  id?: string;
  title?: string;
  description?: string;
  status = '';

  startTime?: Date;
  endTime?: Date;
  totalScore?: number;
  displayedQuestionCount?: number;

  thumbnail?: FileResourcesResponse;
  thumbnailID?: string;

  quizQuestions: UserQuizQuestionResponse[] = [];

  enrollmentCriteria?: EnrollmentCriteriaResponse[];
  quizEnrollments?: QuizEnrollmentCriteriaRelationResponse[];

  fileQuizRelation?: FileQuizRelationResponse[];

  lessonID?: string;
  levelID?: string;

  // NEW
  canStartOver?: boolean;
  canShuffle?: boolean;
  isRequired?: boolean;
  isAutoSubmitted?: boolean;

  type?: string;
  time?: string;
  scoreToPass?: number;
  totalQuestion?: number;
  maxAttempts?: number;

  lesson?: QuizLessonResponse;
  categoryID?: string;
  category?: CategoryResponse;

  userQuizProgress?: UserQuizProgressionResponse[];
  userAnswer?: UserAnswerResponse[];

  attendanceRecords?: AttendanceRecordResponse[];

  // NEW FIELDS (not in your old TS class)
  positionCode?: string;
  positionName?: string;
  positionStateCode?: string;
  positionStateName?: string;

  departmentTypeCode?: string;
  departmentTypeName?: string;

  isFixedQuiz?: boolean;

  startDate?: Date;
  endDate?: Date;

  fixedQuizDayDuration?: number;

  constructor(init?: Partial<QuizResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuizResponse {
    const dto = new QuizResponse();

    dto.id = json.id;
    dto.title = json.title;
    dto.description = json.description;
    dto.status = json.status ?? '';

    dto.startTime = json.startTime ? new Date(json.startTime) : undefined;
    dto.endTime = json.endTime ? new Date(json.endTime) : undefined;
    dto.totalScore = json.totalScore;
    dto.displayedQuestionCount = json.displayedQuestionCount;

    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.thumbnailID = json.thumbnailID;

    dto.quizQuestions = Array.isArray(json.quizQuestions)
      ? json.quizQuestions.map((q: any) => UserQuizQuestionResponse.fromJson(q))
      : [];

    dto.enrollmentCriteria = Array.isArray(json.enrollmentCriteria)
      ? json.enrollmentCriteria.map((e: any) => EnrollmentCriteriaResponse.fromJson(e))
      : undefined;

    dto.quizEnrollments = Array.isArray(json.quizEnrollments)
      ? json.quizEnrollments.map((qe: any) => QuizEnrollmentCriteriaRelationResponse.fromJson(qe))
      : undefined;

    dto.fileQuizRelation = Array.isArray(json.fileQuizRelation)
      ? json.fileQuizRelation.map((f: any) => FileQuizRelationResponse.fromJson(f))
      : undefined;

    dto.lessonID = json.lessonID;
    dto.levelID = json.levelID;

    dto.lesson = json.lesson ? QuizLessonResponse.fromJson(json.lesson) : undefined;

    dto.categoryID = json.categoryID;
    dto.category = json.category ? CategoryResponse.fromJson(json.category) : undefined;

    dto.userQuizProgress = Array.isArray(json.userQuizProgress)
      ? json.userQuizProgress.map((p: any) => UserQuizProgressionResponse.fromJson(p))
      : undefined;

    dto.userAnswer = Array.isArray(json.userAnswer)
      ? json.userAnswer.map((a: any) => UserAnswerResponse.fromJson(a))
      : undefined;

    dto.attendanceRecords = Array.isArray(json.attendanceRecords)
      ? json.attendanceRecords.map((r: any) => AttendanceRecordResponse.fromJson(r))
      : undefined;

    dto.canStartOver = json.canStartOver ?? false;
    dto.canShuffle = json.canShuffle ?? false;
    dto.isRequired = json.isRequired ?? false;
    dto.isAutoSubmitted = json.isAutoSubmitted ?? true;

    dto.type = json.type;
    dto.time = json.time;
    dto.scoreToPass = json.scoreToPass;
    dto.totalQuestion = json.totalQuestion;
    dto.maxAttempts = json.maxAttempts;

    // --------- NEW MAPPINGS ----------
    dto.positionCode = json.positionCode;
    dto.positionName = json.positionName;

    dto.positionStateCode = json.positionStateCode;
    dto.positionStateName = json.positionStateName;

    dto.departmentTypeCode = json.departmentTypeCode;
    dto.departmentTypeName = json.departmentTypeName;

    dto.isFixedQuiz = json.isFixedQuiz;

    dto.startDate = json.startDate ? new Date(json.startDate) : undefined;
    dto.endDate = json.endDate ? new Date(json.endDate) : undefined;

    dto.fixedQuizDayDuration = json.fixedQuizDayDuration;

    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,

      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      totalScore: this.totalScore,
      displayedQuestionCount: this.displayedQuestionCount,

      thumbnail: this.thumbnail?.toJson?.() ?? this.thumbnail,
      thumbnailID: this.thumbnailID,

      quizQuestions: this.quizQuestions.map((q) => (q.toJson ? q.toJson() : q)),
      enrollmentCriteria: this.enrollmentCriteria?.map((e) => (e.toJson ? e.toJson() : e)),
      quizEnrollments: this.quizEnrollments?.map((qe) => (qe.toJson ? qe.toJson() : qe)),

      fileQuizRelation: this.fileQuizRelation?.map((f) => (f.toJson ? f.toJson() : f)),

      lessonID: this.lessonID,
      levelID: this.levelID,
      lesson: this.lesson?.toJson?.() ?? this.lesson,

      categoryID: this.categoryID,
      category: this.category?.toJson?.() ?? this.category,

      userQuizProgress: this.userQuizProgress?.map((p) => (p.toJson ? p.toJson() : p)),
      userAnswer: this.userAnswer?.map((a) => (a.toJson ? a.toJson() : a)),
      attendanceRecords: this.attendanceRecords?.map((r) => (r.toJson ? r.toJson() : r)),

      canStartOver: this.canStartOver,
      canShuffle: this.canShuffle,
      isRequired: this.isRequired,
      isAutoSubmitted: this.isAutoSubmitted,

      type: this.type,
      time: this.time,
      scoreToPass: this.scoreToPass,
      totalQuestion: this.totalQuestion,
      maxAttempts: this.maxAttempts,

      // NEW FIELDS
      positionCode: this.positionCode,
      positionName: this.positionName,

      positionStateCode: this.positionStateCode,
      positionStateName: this.positionStateName,

      departmentTypeCode: this.departmentTypeCode,
      departmentTypeName: this.departmentTypeName,

      isFixedQuiz: this.isFixedQuiz,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      fixedQuizDayDuration: this.fixedQuizDayDuration,
    };
  }
}
