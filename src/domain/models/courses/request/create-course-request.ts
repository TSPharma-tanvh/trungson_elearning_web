import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  CategoryEnum,
  CourseTypeEnum,
  DisplayTypeEnum,
  LessonContentEnum,
  ScheduleStatusEnum,
  StatusEnum,
} from '@/utils/enum/core-enum';

export class CreateCourseRequest {
  pathID?: string;
  detail?: string;
  isRequired?: boolean;

  name!: string;

  disableStatus: StatusEnum = StatusEnum.Enable;

  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;

  isFixedCourse = false;
  teacherID?: string;

  courseType: CourseTypeEnum = CourseTypeEnum.Modular;
  displayType: DisplayTypeEnum = DisplayTypeEnum.Public;

  meetingLink?: string;

  scheduleStatus: ScheduleStatusEnum = ScheduleStatusEnum.Ongoing;

  collections?: CourseCreateLessonCollectionRequest[];

  categoryID?: string;
  thumbnailID?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;

  categoryEnum?: CategoryEnum;

  constructor(init?: Partial<CreateCourseRequest>) {
    Object.assign(this, init);
  }

  toFormData(): FormData {
    const fd = new FormData();

    fd.append('Name', this.name);
    if (this.pathID) fd.append('PathID', this.pathID);
    if (this.detail) fd.append('Detail', this.detail);
    if (this.isRequired !== undefined) fd.append('IsRequired', String(this.isRequired));

    fd.append('DisableStatus', String(this.disableStatus));
    fd.append('IsFixedCourse', String(this.isFixedCourse));
    fd.append('CourseType', String(this.courseType));
    fd.append('DisplayType', String(this.displayType));
    fd.append('ScheduleStatus', String(this.scheduleStatus));

    if (this.positionCode) fd.append('PositionCode', this.positionCode);
    if (this.positionStateCode) fd.append('PositionStateCode', this.positionStateCode);
    if (this.departmentTypeCode) fd.append('DepartmentTypeCode', this.departmentTypeCode);
    if (this.teacherID) fd.append('TeacherID', this.teacherID);
    if (this.meetingLink) fd.append('MeetingLink', this.meetingLink);

    if (this.categoryID) fd.append('CategoryID', this.categoryID);
    if (this.thumbnailID) fd.append('ThumbnailID', this.thumbnailID);

    if (this.thumbnail) fd.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) fd.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) fd.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined) fd.append('IsDeleteOldThumbnail', String(this.isDeleteOldThumbnail));

    if (this.categoryEnum !== undefined) fd.append('CategoryEnum', String(this.categoryEnum));

    if (this.collections?.length) {
      fd.append('Collections', JSON.stringify(this.collections.map((c) => c.toJson())));
    }

    return fd;
  }
}

export class CourseCreateLessonCollectionRequest {
  name?: string;
  order!: number;

  startDate?: Date;
  endDate?: Date;
  fixedCourseDayDuration?: number;

  lessonCollection!: CourseCreateLessonCollectionLessonDetailRequest[];
  quizzes?: QuizzesCollectionCreateDetailRequest[];

  constructor(init?: Partial<CourseCreateLessonCollectionRequest>) {
    Object.assign(this, init);
    this.lessonCollection =
      init?.lessonCollection?.map((x) => new CourseCreateLessonCollectionLessonDetailRequest(x)) || [];
    this.quizzes = init?.quizzes?.map((x) => new QuizzesCollectionCreateDetailRequest(x)) || [];
  }

  toJson(): any {
    return {
      Name: this.name,
      Order: this.order,
      StartDate: this.startDate ? DateTimeUtils.formatISODateToString(this.startDate) : null,
      EndDate: this.endDate ? DateTimeUtils.formatISODateToString(this.endDate) : null,
      FixedCourseDayDuration: this.fixedCourseDayDuration,
      LessonCollection: this.lessonCollection.map((x) => x.toJson()),

      Quizzes: this.quizzes?.map((q) => q.toJson()) ?? null,
    };
  }
}

export class CourseCreateLessonCollectionLessonDetailRequest {
  lessonCollectionName!: string;
  lessonCollectionDetail?: string;
  thumbnailID?: string;
  isRequired?: boolean;

  order!: number;

  lessonType: LessonContentEnum = LessonContentEnum.PDF;
  videoID?: string;
  resourceID?: string;

  constructor(init?: Partial<CourseCreateLessonCollectionLessonDetailRequest>) {
    Object.assign(this, init);
  }

  toJson(): any {
    return {
      LessonCollectionName: this.lessonCollectionName,
      LessonCollectionDetail: this.lessonCollectionDetail,
      ThumbnailID: this.thumbnailID,
      IsRequired: this.isRequired,
      Order: this.order,
      LessonType: this.lessonType,
      VideoID: this.videoID,
      ResourceID: this.resourceID,
    };
  }
}

export class QuizzesCollectionCreateDetailRequest {
  quizId!: string;
  order!: number;

  constructor(init?: Partial<QuizzesCollectionCreateDetailRequest>) {
    Object.assign(this, init);
  }

  toJson(): any {
    return {
      QuizId: this.quizId,
      Order: this.order,
    };
  }
}
