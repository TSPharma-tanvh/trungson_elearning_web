import { ApproveStatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class CreateUserCourseProgressRequest {
  userID?: string;
  courseID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: UserProgressEnum; // required
  enrollmentCriteriaID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  constructor(init?: Partial<CreateUserCourseProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): CreateUserCourseProgressRequest {
    return new CreateUserCourseProgressRequest(data);
  }

  toJSON(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();
    Object.entries(this).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }
}
