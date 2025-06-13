import { SignInUseCase } from '@/domain/usecases/auth/auth-usecase';
import { RoleUsecase } from '@/domain/usecases/role/role-usecase';
import { SendNotificationUseCase } from '@/domain/usecases/SendNotificationUseCase';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';

import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repo-impl';
import { NotificationRepoImpl } from '@/data/repositories/NotificationRepoImpl';
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

  // Use cases
  public sendNotificationUseCase = new SendNotificationUseCase(this.notificationRepo);

  //auth
  public signInUseCase = new SignInUseCase(this.authRepo);

  //user
  public userUsecase = new UserUsecase(this.userRepo);

  //role
  public roleUseCase = new RoleUsecase(this.roleRepo);
}

// Export a singleton container
export const container = new DependencyContainer();
