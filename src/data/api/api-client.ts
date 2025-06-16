// src/data/api/apiClient.ts
import path from 'path';

import { ValidationErrorResponse } from '@/domain/models/core/validation-error-response';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';

import { paths } from '@/paths';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

import { apiEndpoints, getBaseUrl } from './api-endpoints'; // ✅ Add getBaseUrl

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: getBaseUrl(),
      // headers: {
      //   // 'Content-Type': 'application/json',
      //   // Accept: 'application/json',
      //   'Content-Type': undefined,
      // },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      withCredentials: true,
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance.client;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Inject Authorization, Accept-Language, etc.
        const token = ApiClient.getAuthToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        CustomSnackBar.showSnackbar('Request error', 'error');
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data as any;

        if (typeof data?.isSuccessStatusCode === 'boolean') {
          if (!data.isSuccessStatusCode) {
            CustomSnackBar.showSnackbar(data.message || 'Unknown error', 'error');

            throw new Error(data.message || 'API logic error');
          }
        }
        return response;
      },
      // inside this.client.interceptors.response.use(
      async (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const data = error.response?.data as any;

          if (status === 400 && data?.errors) {
            const errorMessages: string[] = [];

            Object.entries(data.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`));
              }
            });

            // Show all validation messages
            errorMessages.forEach((msg) => CustomSnackBar.showSnackbar(msg, 'error'));
          } else {
            const msg = data?.message || data?.title || error.message || 'API error';
            CustomSnackBar.showSnackbar(msg, 'error');
          }

          // Handle 401
          if (status === 401) {
            const refreshToken = StoreLocalManager.getLocalData(AppStrings.REFRESH_TOKEN);
            if (refreshToken) {
              const refreshed = await ApiClient.handleTokenRefresh(refreshToken);
              if (refreshed) {
                const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
                if (originalConfig && !originalConfig._retry) {
                  originalConfig._retry = true;
                  const newToken = ApiClient.getAuthToken();
                  if (newToken && originalConfig.headers) {
                    originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
                  }
                  return this.client.request(originalConfig);
                }
              } else {
                ApiClient.clearTokenAndRedirectToSignIn();
              }
            } else {
              ApiClient.clearTokenAndRedirectToSignIn();
            }
          }
        } else {
          CustomSnackBar.showSnackbar('Unexpected error', 'error');
        }

        return Promise.reject(error);
      }
    );
  }

  private static getAuthToken(): string | null {
    return StoreLocalManager.getLocalData(AppStrings.ACCESS_TOKEN) || null;
  }
  private static clearAuthTokens(): void {
    StoreLocalManager.removeLocalData(AppStrings.ACCESS_TOKEN);
    StoreLocalManager.removeLocalData(AppStrings.REFRESH_TOKEN);
    StoreLocalManager.removeLocalData(AppStrings.USER_ID);
    StoreLocalManager.removeLocalData(AppStrings.USER_DATA);
  }
  private static redirectToSignIn(): void {
    window.location.href = paths.auth.signIn;
  }
  private static clearTokenAndRedirectToSignIn(): void {
    CustomSnackBar.showSnackbar('Session expired. Please sign in again.', 'error');
    ApiClient.clearAuthTokens();
    ApiClient.redirectToSignIn();
  }
  private static async handleTokenRefresh(refreshToken: string): Promise<boolean> {
    try {
      const refreshClient = axios.create({
        baseURL: getBaseUrl(),
        // headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        withCredentials: true,
      });
      const response = await refreshClient.post(apiEndpoints.token.refreshToken, {
        RefreshToken: refreshToken,
      });
      const data = response.data as any;
      if (data.IsSuccess && data.Result && data.StatusCode >= 200 && data.StatusCode < 300) {
        StoreLocalManager.saveLocalData(AppStrings.ACCESS_TOKEN, data.Result.AccessToken);
        StoreLocalManager.saveLocalData(AppStrings.REFRESH_TOKEN, data.Result.RefreshToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Refresh token failed', err);
      return false;
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data);
  }

  public async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url);
  }
}

export const apiClient = ApiClient.getInstance();
