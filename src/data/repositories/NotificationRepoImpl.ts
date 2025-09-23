// src/data/repositories/NotificationRepoImpl.ts
import { type NotificationEntity } from '@/domain/models/Notification';

import { type NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { customApiClient } from '../api/api-client';
import { apiEndpoints } from '../api/api-endpoints';

export class NotificationRepoImpl implements NotificationRepository {
  async sendToUser(notification: NotificationEntity): Promise<void> {
    const payload = notification.toApiPayload();
    const response = await customApiClient.post(apiEndpoints.notifications.sendToUser, payload);
    if (response.data.StatusCode !== 200) {
      throw new Error(response.data.Message || 'Failed to send notification to user');
    }
  }

  async sendToAll(notification: NotificationEntity): Promise<void> {
    const payload = notification.toApiPayload();
    const response = await customApiClient.post(apiEndpoints.notifications.sendToAllDevices, payload);
    if (response.data.StatusCode !== 200) {
      throw new Error(response.data.Message || 'Failed to send notification to all');
    }
  }
}
