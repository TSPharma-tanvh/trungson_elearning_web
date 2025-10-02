import { ApiResponse } from '@/domain/models/core/api-response';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';

import { paths } from '@/paths';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

import { apiEndpoints, getBaseUrl } from './api-endpoints';

//custom options
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  suppressSuccessMessage?: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: getBaseUrl(),
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      withCredentials: true,
      timeout: 100000,
    });
    this.setupInterceptors();
  }

  // instance
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = ApiClient.getAuthToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        CustomSnackBar.showSnackbar('Request error', 'error');
        return Promise.reject(new Error(error.message));
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;

        if (typeof data?.isSuccessStatusCode === 'boolean') {
          if (!data.isSuccessStatusCode) {
            CustomSnackBar.showSnackbar(data.message || 'Unknown error', 'error');
            throw new Error(data.message || 'API logic error');
          } else if (
            data.message &&
            response.config.method?.toLowerCase() !== 'get' &&
            !(response.config as CustomAxiosRequestConfig).suppressSuccessMessage
          ) {
            CustomSnackBar.showSnackbar(data.message, 'success');
          }
        }

        return response;
      },
      async (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const data = error.response?.data;

          if (status === 400 && data?.errors) {
            const errorMessages: string[] = [];
            Object.entries(data.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`));
              }
            });
            errorMessages.forEach((msg) => {
              CustomSnackBar.showSnackbar(msg, 'error');
            });
          } else {
            const msg = data?.message || data?.title || error.message || 'API error';
            CustomSnackBar.showSnackbar(msg, 'error');
          }

          if (status === 401) {
            const refreshToken = StoreLocalManager.getLocalData(AppStrings.REFRESH_TOKEN);
            const accessToken = StoreLocalManager.getLocalData(AppStrings.ACCESS_TOKEN) ?? '';

            if (refreshToken) {
              const refreshed = await ApiClient.handleTokenRefresh(refreshToken, accessToken);
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

        return Promise.reject(new Error(error.message));
      }
    );
  }

  // method
  public async get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data?: unknown, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: unknown, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // helpers
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

  private static async handleTokenRefresh(refreshToken: string, accessToken: string): Promise<boolean> {
    try {
      const refreshClient = axios.create({
        baseURL: getBaseUrl(),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        withCredentials: true,
      });
      const response = await refreshClient.post(apiEndpoints.token.refreshToken, {
        refreshToken,
        accessToken,
      });

      const apiResponse = ApiResponse.fromJson<{ token: string; refreshToken: string }>(response.data);

      if (apiResponse.isSuccessStatusCode && apiResponse.result) {
        StoreLocalManager.saveLocalData(AppStrings.ACCESS_TOKEN, apiResponse.result.token);
        StoreLocalManager.saveLocalData(AppStrings.REFRESH_TOKEN, apiResponse.result.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
      return false;
    }
  }
}

export const customApiClient = ApiClient.getInstance();
