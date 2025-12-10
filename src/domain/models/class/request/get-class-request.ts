import { DateTimeUtils } from '@/utils/date-time-utils';

export class GetClassRequest {
  className?: string;
  locationID?: string;
  teacherID?: string;
  classType?: string;
  scheduleStatus?: string;
  startAtFrom?: Date;
  startAtTo?: Date;
  endAtFrom?: Date;
  endAtTo?: Date;
  enrollmentCriteriaIDs?: string[];
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetClassRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetClassRequest {
    return new GetClassRequest({
      className: json.className,
      locationID: json.locationID,
      teacherID: json.teacherID,
      classType: json.classType,
      scheduleStatus: json.scheduleStatus,
      startAtFrom: json.startAtFrom ? new Date(json.startAtFrom) : undefined,
      startAtTo: json.startAtTo ? new Date(json.startAtTo) : undefined,
      endAtFrom: json.endAtFrom ? new Date(json.endAtFrom) : undefined,
      endAtTo: json.endAtTo ? new Date(json.endAtTo) : undefined,
      enrollmentCriteriaIDs: json.enrollmentCriteriaIDs,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      className: this.className,
      locationID: this.locationID,
      teacherID: this.teacherID,
      classType: this.classType,
      scheduleStatus: this.scheduleStatus,
      startAtFrom: this.startAtFrom ? DateTimeUtils.formatISODateToString(this.startAtFrom) : undefined,
      startAtTo: this.startAtTo ? DateTimeUtils.formatISODateToString(this.startAtTo) : undefined,
      endAtFrom: this.endAtFrom ? DateTimeUtils.formatISODateToString(this.endAtFrom) : undefined,
      endAtTo: this.endAtTo ? DateTimeUtils.formatISODateToString(this.endAtTo) : undefined,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
