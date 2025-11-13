import { QuizResponse } from '../../quiz/response/quiz-response';

export class FileQuizRelationResponseForResources {
  id?: string;
  quizId?: string;
  fileResourceId?: string;
  quiz?: QuizResponse;

  constructor(init?: Partial<FileQuizRelationResponseForResources>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileQuizRelationResponseForResources {
    if (!json) return new FileQuizRelationResponseForResources();
    return new FileQuizRelationResponseForResources({
      id: json.id,
      quizId: json.quizId,
      fileResourceId: json.fileResourceId,
      quiz: json.quiz ? QuizResponse.fromJson(json.quiz) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      quizId: this.quizId,
      fileResourceId: this.fileResourceId,
      quiz: this.quiz?.toJson(),
    };
  }
}
