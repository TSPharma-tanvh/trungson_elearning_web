import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { CourseRepository } from '@/domain/repositories/courses/course-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

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

  async getCourseById(id: string): Promise<CourseDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.courseRepo.getCourseById(id);

    var userResponse = CourseDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createCourse(request: CreateCourseRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.createCourse(request);

    return response;
  }

  async updateCourse(request: UpdateCourseRequest): Promise<ApiResponse> {
    var result = await this.courseRepo.updateCourse(request);

    return result;
  }

  async deleteCourse(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateCourseRequest({
      id: id ?? '',
      disableStatus: StatusEnum.Deleted,
    });

    var result = await this.courseRepo.updateCourse(newFormData);

    return result;
  }
}
