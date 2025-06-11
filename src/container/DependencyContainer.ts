// src/container/DependencyContainer.ts

import { SignInUseCase } from '@/domain/usecases/auth/auth-usecase';
import { SendNotificationUseCase } from '@/domain/usecases/SendNotificationUseCase';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';

import { AuthRepositoryImpl } from '@/data/repositories/auth/auth-repo-impl';
import { NotificationRepoImpl } from '@/data/repositories/NotificationRepoImpl';
import { UserRepositoryImpl } from '@/data/repositories/user/user-repo-impl';

export class DependencyContainer {
  // Repository instances

  public notificationRepo = new NotificationRepoImpl();

  //auth
  public authRepo = new AuthRepositoryImpl();

  //user
  public userRepo = new UserRepositoryImpl();

  // Use cases
  public sendNotificationUseCase = new SendNotificationUseCase(this.notificationRepo);

  //auth
  public signInUseCase = new SignInUseCase(this.authRepo);

  //user
  public userUsecase = new UserUsecase(this.userRepo);
}

// Export a singleton container
export const container = new DependencyContainer();
