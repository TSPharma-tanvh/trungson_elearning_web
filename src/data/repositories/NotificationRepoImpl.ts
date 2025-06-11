// src/data/repositories/NotificationRepoImpl.ts
import { NotificationEntity } from '@/domain/models/Notification';

import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { apiClient } from '../api/apiClient';
import { apiEndpoints } from '../api/apiEndpoints';

export class NotificationRepoImpl implements NotificationRepository {
  async sendToUser(notification: NotificationEntity): Promise<void> {
    const payload = notification.toApiPayload();
    const response = await apiClient.post(apiEndpoints.notifications.sendToUser, payload);
    if (response.data.StatusCode !== 200) {
      throw new Error(response.data.Message || 'Failed to send notification to user');
    }
  }

  async sendToAll(notification: NotificationEntity): Promise<void> {
    const payload = notification.toApiPayload();
    const response = await apiClient.post(apiEndpoints.notifications.sendToAllDevices, payload);
    if (response.data.StatusCode !== 200) {
      throw new Error(response.data.Message || 'Failed to send notification to all');
    }
  }
}
