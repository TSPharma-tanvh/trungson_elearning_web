import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { QuestionResponse } from '../../question/response/question-response';

export class QuizResponse {
  id?: string;
  title?: string;
  description?: string;
  status: string = '';
  startTime?: Date;
  endTime?: Date;
  totalScore?: number;
  thumbnail?: FileResourcesResponse;
  quizQuestions: QuestionResponse[] = [];
  enrollmentCriteria?: EnrollmentCriteriaResponse[];
  fileQuizRelation?: any[] = [];

  constructor(init?: Partial<QuizResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): QuizResponse {
    const dto = new QuizResponse();
    Object.assign(dto, json);
    dto.startTime = json.startTime ? new Date(json.startTime) : undefined;
    dto.endTime = json.endTime ? new Date(json.endTime) : undefined;
    // Implement fromJSON for nested objects if needed
    return dto;
  }

  toJSON(): any {
    return {
      ...this,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
    };
  }
}
