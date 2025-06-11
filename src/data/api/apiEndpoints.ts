// src/data/api/apiEndpoints.ts

/**
 * Centralizes all API endpoint paths (relative to base URL).
 * You can easily switch base URL via NEXT_PUBLIC_API_BASE_URL in env.
 * Also, endpoints methods can catch/format errors if desired.
 */

type EndpointDefinitions = {
  identity: {
    signIn: string;
    signUp: string;
    forgotPassword: string;
  };
  token: {
    refreshToken: string;
  };
  user: {
    getAll: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  notifications: {
    getAll: string;
    sendToUser: string;
    sendToAllDevices: string;
    delete: string;
    getAllUserNotification: string;
  };
  pharmacy: {
    getAll: string;
    update: string;
    getById: (id: string) => string;
    deleteImage: string;
  };
  // ...add other categories here
};

class ApiEndpoints {
  private static instance: ApiEndpoints;
  public readonly baseUrl: string;
  public readonly Identity: EndpointDefinitions['identity'];
  public readonly token: EndpointDefinitions['token'];
  public readonly user: EndpointDefinitions['user'];
  public readonly notifications: EndpointDefinitions['notifications'];
  public readonly pharmacy: EndpointDefinitions['pharmacy'];
  // add more categories...

  private constructor() {
    const local = process.env.NEXT_PUBLIC_LOCAL_DEV_BASE_URL;
    const production = process.env.NEXT_PUBLIC_PRODUCTION_DEV_BASE_URL;

    if (!local) {
      throw new Error(
        'Missing LOCAL_DEV_BASE_URL environment variable. Please define it in .env.local or appropriate env.'
      );
    }

    if (!production) {
      throw new Error(
        'Missing PRODUCTION_BASE_URL environment variable. Please define it in .env.local or appropriate env.'
      );
    }

    // Remove trailing slash if any:
    this.baseUrl = local.replace(/\/+$/, '');

    // Define relative paths (no leading slash) so axios baseURL can prepend:
    this.Identity = {
      signIn: 'Identity/Login',
      signUp: 'Auth/Sign-up',
      forgotPassword: 'Auth/Forgot-password',
    };

    this.token = {
      refreshToken: 'Token/Get-Access-Token',
    };

    this.user = {
      getAll: 'Users',
      getById: (id: string) => `User/GetUserInfoById/${id}`,
      create: 'Users',
      update: (id: string) => `User/UpdateUser/${id}`,
      delete: (id: string) => `Users/${id}`,
    };

    this.notifications = {
      getAll: 'notification/get-all-notification',
      sendToUser: 'notification/send-to-user',
      sendToAllDevices: 'notification/send-to-all-devices',
      delete: 'notification/delete-notification',
      getAllUserNotification: 'notification/get-all-user-notification',
    };

    this.pharmacy = {
      getAll: 'Pharmacy/Get-Pharmacy-Info',
      update: 'Pharmacy/Update-Pharmacy-Info',
      getById: (id: string) => `Pharmacy/Get-Pharmacy-Info-By-Id/${id}`,
      deleteImage: 'Pharmacy/Delete-Pharmacy-Image',
    };

    // ...init other endpoint groups similarly
  }

  public static getInstance(): ApiEndpoints {
    if (!ApiEndpoints.instance) {
      ApiEndpoints.instance = new ApiEndpoints();
    }
    return ApiEndpoints.instance;
  }

  /**
   * Helper to build full URL string if needed outside axios.
   * E.g., ApiEndpoints.getInstance().fullUrl('Auth/Sign-in')
   */
  public fullUrl(path: string): string {
    // Ensure no duplicate slashes
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }
}

export const apiEndpoints = ApiEndpoints.getInstance();
