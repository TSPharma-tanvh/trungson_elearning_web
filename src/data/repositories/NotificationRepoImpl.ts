// src/data/repositories/NotificationRepoImpl.ts
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type NotificationEntity } from '@/domain/models/Notification';
import { type NotificationRepository } from '@/domain/repositories/NotificationRepository';

import { customApiClient } from '../api/api-client';
import { apiEndpoints } from '../api/api-endpoints';

export class NotificationRepoImpl implements NotificationRepository {
  async sendToUser(notification: NotificationEntity): Promise<ApiResponse> {
    try {
      const payload = notification.toApiPayload();
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.notifications.sendToUser, payload);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Failed to send notification to user');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to send notification to user');
    }
  }

  async sendToAll(notification: NotificationEntity): Promise<ApiResponse> {
    try {
      const payload = notification.toApiPayload();
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.notifications.sendToAllDevices, payload);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Failed to send notification to all devices');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to send notification to all devices');
    }
  }
}
