import { CreateLessonRequest } from '@/domain/lessons/request/create-lesson-request';
import { GetLessonRequest } from '@/domain/lessons/request/get-lesson-request';
import { UpdateLessonRequest } from '@/domain/lessons/request/update-lesson-request';
import { LessonDetailResponse } from '@/domain/lessons/response/lesson-detail-response';
import { LessonDetailListResult } from '@/domain/lessons/response/lesson-detail-result';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { LessonRepository } from '@/domain/repositories/lessons/lesson-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class LessonUsecase {
  constructor(private readonly lessonRepo: LessonRepository) {}

  async getLessonListInfo(request: GetLessonRequest): Promise<LessonDetailListResult> {
    const result = await this.lessonRepo.getLessonListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(LessonDetailResponse.fromJSON);

    return {
      Lessons: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getLessonById(id: string): Promise<LessonDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.lessonRepo.getLessonById(id);

    var userResponse = LessonDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createLesson(request: CreateLessonRequest): Promise<ApiResponse> {
    const response = await this.lessonRepo.createLesson(request);

    return response;
  }

  async updateLesson(request: UpdateLessonRequest): Promise<ApiResponse> {
    var result = await this.lessonRepo.updateLesson(request);

    return result;
  }

  async deletePath(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateLessonRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    var result = await this.lessonRepo.updateLesson(newFormData);

    return result;
  }
}
