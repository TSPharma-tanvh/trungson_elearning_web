import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserCourseProgressRequest } from '@/domain/models/user-course/request/create-user-course-progress-request';
import { type EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { type GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { type UserCourseProgressResult } from '@/domain/models/user-course/response/user-course-progress-result';
import { type UserCourseProgressRepository } from '@/domain/repositories/progress/user-course-progress-repository';
import { StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class UserCourseProgressUsecase {
  constructor(private readonly userCourseProgressRepo: UserCourseProgressRepository) {}

  async getUserCourseProgressListInfo(request: GetUserCourseProgressRequest): Promise<UserCourseProgressResult> {
    const result = await this.userCourseProgressRepo.getUserCourseProgressListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(UserCourseProgressResponse.fromJSON);

    return {
      courses: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getUserCourseProgressById(id: string): Promise<UserCourseProgressResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.userCourseProgressRepo.getUserCourseProgressById(id);

    const userResponse = UserCourseProgressResponse.fromJSON(result.result);

    return userResponse;
  }

  async createUserCourseProgress(request: CreateUserCourseProgressRequest): Promise<ApiResponse> {
    const response = await this.userCourseProgressRepo.createUserCourseProgress(request);

    return response;
  }

  async updateUserCourseProgress(request: UpdateUserCourseProgressRequest): Promise<ApiResponse> {
    const result = await this.userCourseProgressRepo.updateUserCourseProgress(request);

    return result;
  }

  async enrollUserCourseProgress(request: EnrollUserListToCourseRequest): Promise<ApiResponse> {
    const response = await this.userCourseProgressRepo.enrollUserListToCourse(request);

    return response;
  }

  async deleteUserCourseProgress(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateUserCourseProgressRequest({
      id: id ?? '',
      status: UserProgressEnum[UserProgressEnum.Done],
    });

    const result = await this.userCourseProgressRepo.updateUserCourseProgress(newFormData);

    return result;
  }
}
