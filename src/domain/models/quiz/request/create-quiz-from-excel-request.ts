import { type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateQuizFromExcelRequest {
  excelFile!: File;
  quizID!: string;
  scoreToPass!: number;

  questionCategoryID!: string;
  questionCategoryEnum!: CategoryEnum;

  answerCategoryID!: string;
  answerCategoryEnum!: CategoryEnum;

  constructor(init?: Partial<CreateQuizFromExcelRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateQuizFromExcelRequest {
    const dto = new CreateQuizFromExcelRequest();
    Object.assign(dto, json);
    return dto;
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('ExcelFile', this.excelFile);
    formData.append('QuizID', this.quizID);
    formData.append('ScoreToPass', this.scoreToPass.toString());
    formData.append('QuestionCategoryID', this.questionCategoryID);
    formData.append('QuestionCategoryEnum', this.questionCategoryEnum.toString());
    formData.append('AnswerCategoryID', this.answerCategoryID);
    formData.append('AnswerCategoryEnum', this.answerCategoryEnum.toString());
    return formData;
  }
}
