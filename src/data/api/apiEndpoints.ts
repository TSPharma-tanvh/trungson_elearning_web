interface EndpointCategory {
  [key: string]: string | ((...args: string[]) => string);
}

interface EndpointDefinitions {
  identity: EndpointCategory;
  token: EndpointCategory;
  user: EndpointCategory;
  notifications: EndpointCategory;
  role: EndpointCategory;
}

const endpoints: EndpointDefinitions = {
  identity: {
    signIn: 'Identity/Login',
    signUp: 'Auth/Sign-up',
    forgotPassword: 'Auth/Forgot-password',
  },
  token: {
    refreshToken: 'Token/Get-Access-Token',
  },
  user: {
    getAll: 'User/GetUsers',
    getById: (id: string) => `User/GetUserInfoById/${id}`,
    update: (id: string) => `User/UpdateUser/${id}`,
    delete: (id: string) => `User/DeleteUser/${id}`,
  },
  notifications: {
    getAll: 'notification/get-all-notification',
    sendToUser: 'notification/send-to-user',
    sendToAllDevices: 'notification/send-to-all-devices',
    delete: 'notification/delete-notification',
    getAllUserNotification: 'notification/get-all-user-notification',
  },
  role: {
    getAll: 'Role/GetRoles',
  },
};

const getBaseUrl = (): string => {
  const local = process.env.NEXT_PUBLIC_LOCAL_DEV_BASE_URL;
  const production = process.env.NEXT_PUBLIC_PRODUCTION_DEV_BASE_URL;

  // Use production URL in production, otherwise local
  const baseUrl = process.env.NODE_ENV === 'production' ? production : local;

  if (!baseUrl) {
    throw new Error(
      `Missing ${process.env.NODE_ENV === 'production' ? 'NEXT_PUBLIC_PRODUCTION_DEV_BASE_URL' : 'NEXT_PUBLIC_LOCAL_DEV_BASE_URL'} environment variable.`
    );
  }

  // Remove trailing slash
  return baseUrl.replace(/\/+$/, '');
};

/**
 * Get full URL for an endpoint
 * @param endpoint - The endpoint path or function
 * @param args - Arguments for dynamic endpoints
 */
export const getApiUrl = (endpoint: string | ((...args: string[]) => string), ...args: string[]): string => {
  const path = typeof endpoint === 'function' ? endpoint(...args) : endpoint;
  return `${getBaseUrl()}/${path.replace(/^\/+/, '')}`;
};

/**
 * Export endpoints for direct access
 */
export const apiEndpoints = endpoints;
export { getBaseUrl };
