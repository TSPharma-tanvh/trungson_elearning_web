import { SignInUseCase } from '@/domain/usecases/auth/auth-usecase';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { FileResourcesUsecase } from '@/domain/usecases/file/file-usecase';
import { PathUsecase } from '@/domain/usecases/path/path-usecase';
import { RoleUsecase } from '@/domain/usecases/role/role-usecase';
import { SendNotificationUseCase } from '@/domain/usecases/SendNotificationUseCase';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';

import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repo-impl';
import { CategoryRepositoryImpl } from '@/data/repositories/category/category-repo-impl';
import { CourseRepoImpl } from '@/data/repositories/courses/courses-repo-impl';
import { EnrollmentRepoImpl } from '@/data/repositories/enrollment/enrollment-repo-impl';
import { FileResourceRepositoryImpl } from '@/data/repositories/file/file-resource-repo-impl';
import { NotificationRepoImpl } from '@/data/repositories/NotificationRepoImpl';
import { PathRepoImpl } from '@/data/repositories/path/path-repo.impl';
import { RoleRepositoryImpl } from '@/data/repositories/role/role-repo-impl';
import { UserRepositoryImpl } from '@/data/repositories/user/user-repo-impl';

export class DependencyContainer {
  // Repository instances

  public notificationRepo = new NotificationRepoImpl();

  //auth
  public authRepo = new AuthRepositoryImpl();

  //user
  public userRepo = new UserRepositoryImpl();

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

  //resource
  public fileRepo = new FileResourceRepositoryImpl();

  /// Use cases
  public sendNotificationUseCase = new SendNotificationUseCase(this.notificationRepo);

  //auth
  public signInUseCase = new SignInUseCase(this.authRepo);

  //user
  public userUsecase = new UserUsecase(this.userRepo);

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

  //file resource
  public fileUsecase = new FileResourcesUsecase(this.fileRepo);
}

// Export a singleton container
export const container = new DependencyContainer();
