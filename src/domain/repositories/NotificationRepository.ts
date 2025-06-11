// import { NotificationEntity } from "../models/Notification";
import { NotificationEntity } from '../../domain/models/Notification';

export interface NotificationRepository {
  /**
   * Send a notification to a specific user (by phone or ID).
   * Throws on failure.
   */
  sendToUser(notification: NotificationEntity): Promise<void>;

  /**
   * Send a notification to all devices/users.
   */
  sendToAll(notification: NotificationEntity): Promise<void>;

  // add other methods, e.g., get list, delete, etc.
}
