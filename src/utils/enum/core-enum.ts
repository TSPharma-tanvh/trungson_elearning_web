export enum StatusEnum {
  Enable = 0,
  Disable = 1,
  Deleted = 2,
}

export enum DisplayTypeEnum {
  Public = 0,
  Private = 1,
}

export enum LearningModeEnum {
  Online = 0,
  Offline = 1,
}

export enum ScheduleStatusEnum {
  Schedule = 0,
  Ongoing = 1,
  Cancelled = 2,
}

export enum ActiveEnum {
  Active = 0,
  Inactive = 1,
}

export enum UserProgressEnum {
  NotStarted = 0,
  Ongoing = 1,
  Done = 2,
}

export enum CategoryEnum {
  Path = 0,
  Course = 1,
  Lesson = 2,
  Class = 3,
  Quiz = 4,
  Question = 5,
  Answer = 6,
  Criteria = 7,
}

export class CategoryEnumUtils {
  static getCategoryKeys(): string[] {
    return Object.keys(CategoryEnum).filter((key) => isNaN(Number(key)));
  }

  static getCategoryOptions(): { label: string; value: CategoryEnum }[] {
    return Object.keys(CategoryEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: CategoryEnum[key as keyof typeof CategoryEnum],
      }));
  }

  static getCategoryKeyFromValue(value: CategoryEnum): string | undefined {
    return CategoryEnum[value];
  }
}
