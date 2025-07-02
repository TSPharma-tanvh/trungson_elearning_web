export class QuizLessonResponse {
  id?: string;
  title?: string;
  description?: string;
  status: string = '';
  startTime?: string;
  endTime?: string;
  totalScore?: number;

  constructor(init?: Partial<QuizLessonResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): QuizLessonResponse {
    return new QuizLessonResponse({
      id: json.id,
      title: json.title,
      description: json.description,
      status: json.status ?? '',
      startTime: json.startTime,
      endTime: json.endTime,
      totalScore: json.totalScore,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      totalScore: this.totalScore,
    };
  }
}
