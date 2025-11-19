import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { type GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { type CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { type CourseRepository } from '@/domain/repositories/courses/course-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class CourseUsecase {
  constructor(private readonly courseRepo: CourseRepository) {}

  async getCourseListInfo(request: GetCourseRequest): Promise<CourseDetailListResult> {
    const result = await this.courseRepo.getCourseListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(CourseDetailResponse.fromJson);
    const data = result.result.map((x) => CourseDetailResponse.fromJson(x));

    return {
      courses: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getCourseById(id: string): Promise<CourseDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.courseRepo.getCourseById(id);

    const userResponse = CourseDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createCourse(request: CreateCourseRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.createCourse(request);

    return response;
  }

  async updateCourse(request: UpdateCourseRequest): Promise<ApiResponse> {
    const result = await this.courseRepo.updateCourse(request);

    return result;
  }

  async deleteCourse(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateCourseRequest({
      id: id ?? '',
      disableStatus: StatusEnum[StatusEnum.Deleted],
    });

    const result = await this.courseRepo.updateCourse(newFormData);

    return result;
  }

  async deleteCoursePermanently(id: string): Promise<ApiResponse> {
    const result = await this.courseRepo.deleteCourse(id);

    return result;
  }
}
