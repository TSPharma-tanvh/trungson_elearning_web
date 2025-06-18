import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { CourseRepository } from '@/domain/repositories/courses/course-repository';

export class CourseUsecase {
  constructor(private readonly courseRepo: CourseRepository) {}

  async getCourseListInfo(request: GetCourseRequest): Promise<CourseDetailListResult> {
    const result = await this.courseRepo.getCourseListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(CourseDetailResponse.fromJSON);

    return {
      courses: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }
}
