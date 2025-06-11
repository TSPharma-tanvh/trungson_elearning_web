// src/domain/usecases/SendNotificationUseCase.ts
import { NotificationEntity } from '../models/Notification';
import { NotificationRepository } from '../repositories/NotificationRepository';

export class SendNotificationUseCase {
  constructor(private notificationRepo: NotificationRepository) {}

  /**
   * Send notification to a specific user.
   */
  async executeToUser(notification: NotificationEntity): Promise<void> {
    // domain-level validations can go here
    if (!notification.recipientPhone) {
      throw new Error('Recipient phone is required for sendToUser');
    }
    await this.notificationRepo.sendToUser(notification);
  }

  /**
   * Send notification to all.
   */
  async executeToAll(notification: NotificationEntity): Promise<void> {
    await this.notificationRepo.sendToAll(notification);
  }
}
