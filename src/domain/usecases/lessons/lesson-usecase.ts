import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { type GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { type LessonDetailListResult } from '@/domain/models/lessons/response/lesson-detail-result';
import { type LessonRepository } from '@/domain/repositories/lessons/lesson-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class LessonUsecase {
  constructor(private readonly lessonRepo: LessonRepository) {}

  async getLessonListInfo(request: GetLessonRequest): Promise<LessonDetailListResult> {
    const result = await this.lessonRepo.getLessonListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(LessonDetailResponse.fromJSON);
    const data = result.result.map((x) => LessonDetailResponse.fromJSON(x));

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

    const result = await this.lessonRepo.getLessonById(id);

    const userResponse = LessonDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createLesson(request: CreateLessonRequest): Promise<ApiResponse> {
    const response = await this.lessonRepo.createLesson(request);

    return response;
  }

  async updateLesson(
    request: UpdateLessonRequest,
    options?: { suppressSuccessMessage?: boolean }
  ): Promise<ApiResponse> {
    const result = await this.lessonRepo.updateLesson(request, options);

    return result;
  }

  async deleteLesson(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateLessonRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    const result = await this.lessonRepo.updateLesson(newFormData);

    return result;
  }
}
