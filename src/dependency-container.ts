import { AnswerUsecase } from '@/domain/usecases/answer/answer-usecase';
import { SignInUseCase } from '@/domain/usecases/auth/auth-usecase';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { ClassTeacherUsecase } from '@/domain/usecases/class/class-teacher-usecase';
import { ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { FileResourcesUsecase } from '@/domain/usecases/file/file-usecase';
import { LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import { PathUsecase } from '@/domain/usecases/path/path-usecase';
import { UserPathProgressUsecase } from '@/domain/usecases/progress/user-path-progress-usecase';
import { QuestionUsecase } from '@/domain/usecases/question/question-usecase';
import { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { RoleUsecase } from '@/domain/usecases/role/role-usecase';
import { SendNotificationUseCase } from '@/domain/usecases/SendNotificationUseCase';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';

import { AnswerRepoImpl } from '@/data/repositories/answer/answer-repo-impl';
import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repo-impl';
import { CategoryRepositoryImpl } from '@/data/repositories/category/category-repo-impl';
import { ClassRepoImpl } from '@/data/repositories/class/class-repo-impl';
import { ClassTeacherRepoImpl } from '@/data/repositories/class/class-teacher-repo-impl';
import { CourseRepoImpl } from '@/data/repositories/courses/courses-repo-impl';
import { EnrollmentRepoImpl } from '@/data/repositories/enrollment/enrollment-repo-impl';
import { FileResourceRepositoryImpl } from '@/data/repositories/file/file-resource-repo-impl';
import { LessonRepoImpl } from '@/data/repositories/lesson/lesson-repo-impl';
import { NotificationRepoImpl } from '@/data/repositories/NotificationRepoImpl';
import { PathRepoImpl } from '@/data/repositories/path/path-repo.impl';
import { UserPathProgressRepoImpl } from '@/data/repositories/progress/user-path-progress-repo-impl';
import { QuestionRepoImpl } from '@/data/repositories/question/question-repo-impl';
import { QuizRepoImpl } from '@/data/repositories/quiz/quiz-repo-impl';
import { RoleRepositoryImpl } from '@/data/repositories/role/role-repo-impl';
import { UserRepositoryImpl } from '@/data/repositories/user/user-repo-impl';

import { AttendanceRecordsRepoImpl } from './data/repositories/class/attendance-records-repo-impl';
import { DepartmentRepoImpl } from './data/repositories/department/department-repo-impl';
import { EmployeeRepoImpl } from './data/repositories/employee/employee-repo-impl';
import { UserAnswerRepoImpl } from './data/repositories/progress/user-answer-repo-impl';
import { UserCourseProgressRepoImpl } from './data/repositories/progress/user-course-progress-repo-impl';
import { UserLessonProgressRepoImpl } from './data/repositories/progress/user-lesson-progress-repo-impl';
import { UserQuizProgressRepoImpl } from './data/repositories/progress/user-quiz-progress-repo-impl';
import { UserDevicesRepoImpl } from './data/repositories/user/user-devices-repo-impl';
import { AttendanceRecordsUsecase } from './domain/usecases/class/attendance-records-usecase';
import { DepartmentUsecase } from './domain/usecases/department/department-usecase';
import { EmployeeUsecase } from './domain/usecases/employee/employee-usecase';
import { UserAnswerUsecase } from './domain/usecases/progress/user-answer-usecase';
import { UserCourseProgressUsecase } from './domain/usecases/progress/user-course-progress-usecase';
import { UserLessonProgressUsecase } from './domain/usecases/progress/user-lesson-progress-usecase';
import { UserQuizProgressUsecase } from './domain/usecases/progress/user-quiz-progress-usecase';
import { UserDevicesUsecase } from './domain/usecases/user/user-device-usecase';

export class DependencyContainer {
  // Repository instances

  public notificationRepo = new NotificationRepoImpl();

  //auth
  public authRepo = new AuthRepositoryImpl();

  //user
  public userRepo = new UserRepositoryImpl();
  public userDeviceRepo = new UserDevicesRepoImpl();

  //role
  public roleRepo = new RoleRepositoryImpl();

  //path
  public pathRepo = new PathRepoImpl();

  //category
  public categoryRepo = new CategoryRepositoryImpl();

  //enrollment
  public enrollRepo = new EnrollmentRepoImpl();

  //course
  public courseRepo = new CourseRepoImpl();

  //lesson
  public lessonRepo = new LessonRepoImpl();

  //class
  public classRepo = new ClassRepoImpl();
  public attendanceRecordsRepo = new AttendanceRecordsRepoImpl();

  //teacher
  public classTeacherRepo = new ClassTeacherRepoImpl();

  //resource
  public fileRepo = new FileResourceRepositoryImpl();

  //quiz
  public quizRepo = new QuizRepoImpl();

  //question
  public questionRepo = new QuestionRepoImpl();

  //answer
  public answerRepo = new AnswerRepoImpl();

  //employee
  public employeeRepo = new EmployeeRepoImpl();

  //department
  public departmentRepo = new DepartmentRepoImpl();

  //progress
  public userPathProgressRepo = new UserPathProgressRepoImpl();
  public userCourseProgressRepo = new UserCourseProgressRepoImpl();
  public userLessonProgressRepo = new UserLessonProgressRepoImpl();
  public userQuizProgressRepo = new UserQuizProgressRepoImpl();
  public userAnswerRepo = new UserAnswerRepoImpl();

  /// Use cases
  public sendNotificationUseCase = new SendNotificationUseCase(this.notificationRepo);

  //auth
  public signInUseCase = new SignInUseCase(this.authRepo);

  //user
  public userUsecase = new UserUsecase(this.userRepo);
  public userDevicesUsecase = new UserDevicesUsecase(this.userDeviceRepo);

  //role
  public roleUseCase = new RoleUsecase(this.roleRepo);

  //path
  public pathUseCase = new PathUsecase(this.pathRepo);

  //category
  public categoryUsecase = new CategoryUsecase(this.categoryRepo);

  //enrollment
  public enrollUsecase = new EnrollmentUsecase(this.enrollRepo);

  //course
  public courseUsecase = new CourseUsecase(this.courseRepo);

  //lesson
  public lessonUsecase = new LessonUsecase(this.lessonRepo);

  //class
  public classUsecase = new ClassUsecase(this.classRepo);
  public attendanceRecordsUsecase = new AttendanceRecordsUsecase(this.attendanceRecordsRepo);

  //teacher
  public classTeacherUsecase = new ClassTeacherUsecase(this.classTeacherRepo);

  //quiz
  public quizUsecase = new QuizUsecase(this.quizRepo);

  //question
  public questionUsecase = new QuestionUsecase(this.questionRepo);

  //answer
  public answerUsecase = new AnswerUsecase(this.answerRepo);

  //file resource
  public fileUsecase = new FileResourcesUsecase(this.fileRepo);

  //employee
  public employeeUsecase = new EmployeeUsecase(this.employeeRepo);

  //department
  public departmentUsecase = new DepartmentUsecase(this.departmentRepo);

  //progress
  public userPathProgressUsecase = new UserPathProgressUsecase(this.userPathProgressRepo);
  public userCourseProgressUsecase = new UserCourseProgressUsecase(this.userCourseProgressRepo);
  public userLessonProgressUsecase = new UserLessonProgressUsecase(this.userLessonProgressRepo);
  public userQuizProgressUsecase = new UserQuizProgressUsecase(this.userQuizProgressRepo);
  public userAnswerUsecase = new UserAnswerUsecase(this.userAnswerRepo);
}

// Export a singleton container
export const container = new DependencyContainer();
