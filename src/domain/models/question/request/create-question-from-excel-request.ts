export class CreateQuestionsFromExcelDto {
  excelFile!: File;
  canShuffle!: boolean;
  questionCategoryID!: string;
  questionCategoryEnum!: string;

  constructor(init?: Partial<CreateQuestionsFromExcelDto>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateQuestionsFromExcelDto {
    return new CreateQuestionsFromExcelDto({
      canShuffle: json.canShuffle,
      questionCategoryID: json.questionCategoryID,
      questionCategoryEnum: json.questionCategoryEnum,
    });
  }

  toJson() {
    return {
      canShuffle: this.canShuffle,
      questionCategoryID: this.questionCategoryID,
      questionCategoryEnum: this.questionCategoryEnum,
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    if (!this.excelFile) {
      throw new Error('excelFile is required.');
    }

    form.append('ExcelFile', this.excelFile);
    form.append('CanShuffle', String(this.canShuffle));
    form.append('QuestionCategoryID', this.questionCategoryID);
    form.append('QuestionCategoryEnum', this.questionCategoryEnum.toString());

    return form;
  }
}
