import { CategoryEnum } from '@/utils/enum/core-enum';

export class CreateQuizFromExcelRequest {
  excelFile!: File;
  quizID!: string;
  questionCategoryID!: string;
  scoreToPass!: number;
  categoryEnum!: CategoryEnum;

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
    formData.append('QuestionCategoryID', this.questionCategoryID);
    formData.append('ScoreToPass', this.scoreToPass.toString());
    formData.append('CategoryEnum', this.categoryEnum.toString());
    return formData;
  }
}
