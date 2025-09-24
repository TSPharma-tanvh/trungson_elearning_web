import { type ApiResponse } from '../models/core/api-response';
import { type NotificationEntity } from '../models/Notification';

export interface NotificationRepository {
  /**
   * Send a notification to a specific user (by phone or ID).
   * Throws on failure.
   */
  sendToUser: (notification: NotificationEntity) => Promise<ApiResponse>;

  /**
   * Send a notification to all devices/users.
   */
  sendToAll: (notification: NotificationEntity) => Promise<ApiResponse>;
}
