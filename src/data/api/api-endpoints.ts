// Define two types: one for static (string) and one for dynamic (function)
type StaticEndpoint = string;
type DynamicEndpoint = (...args: string[]) => string;

interface IdentityEndpoints {
  signIn: StaticEndpoint;
  signUp: StaticEndpoint;
  forgotPassword: StaticEndpoint;
  changePassword: StaticEndpoint;
}

interface TokenEndpoints {
  refreshToken: StaticEndpoint;
}

interface UserEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  update: DynamicEndpoint;
  delete: DynamicEndpoint;
}

interface NotificationEndpoints {
  getAll: StaticEndpoint;
  sendToUser: StaticEndpoint;
  sendToAllDevices: StaticEndpoint;
  delete: StaticEndpoint;
  getAllUserNotification: StaticEndpoint;
}

interface RoleEndpoints {
  getAll: StaticEndpoint;
  getPermissions: StaticEndpoint;
  createRole: StaticEndpoint;
  updateRole: DynamicEndpoint;
  deleteRole: DynamicEndpoint;
}

interface PathEnpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface CategoryEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
}

interface EnrollmentCriteriaEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
}

interface CoursesEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface FileResourcesEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
}

// Main type containing all endpoint categories
interface EndpointDefinitions {
  identity: IdentityEndpoints;
  token: TokenEndpoints;
  user: UserEndpoints;
  notifications: NotificationEndpoints;
  role: RoleEndpoints;
  path: PathEnpoints;
  category: CategoryEndpoints;
  enrollment: EnrollmentCriteriaEndpoints;
  courses: CoursesEndpoints;
  fileResources: FileResourcesEndpoints;
}

//endpoint values
const endpoints: EndpointDefinitions = {
  identity: {
    signIn: 'Identity/Login',
    signUp: 'Identity/Register',
    forgotPassword: 'Auth/Forgot-password',
    changePassword: 'Identity/ChangePassword',
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
    getPermissions: 'Role/GetPermissions',
    createRole: 'Role/CreateRole',
    updateRole: (id: string) => `Role/UpdateRole/${id}`,
    deleteRole: (id: string) => `Role/DeleteRole/${id}`,
  },
  path: {
    getAll: 'CoursePath/GetCoursePaths',
    getById: (id: string) => `CoursePath/GetCoursePathById/${id}`,
    create: 'CoursePath/CreateCoursePath',
    update: 'CoursePath/UpdateCoursePath',
  },
  category: {
    getAll: 'Category/GetCategories',
    getById: (id: string) => `Category/GetCategory/${id}`,
  },
  enrollment: {
    getAll: 'EnrollmentCriteria/GetEnrollmentCriteria',
    getById: (id: string) => `EnrollmentCriteria/GetEnrollmentCriteriaById/${id}`,
  },
  courses: {
    getAll: 'Course/GetCourse',
    getById: (id: string) => `Course/GetCourseById/${id}`,
    create: 'Course/CreateCourse',
    update: 'Course/UpdateCourse',
  },
  fileResources: {
    getAll: 'Resource/GetFileResources',
    getById: (id: string) => `Resource/GetFileResourcesById/${id}`,
  },
};

const getBaseUrl = (): string => {
  const local = process.env.NEXT_PUBLIC_LOCAL_DEV_BASE_URL;
  const production = process.env.NEXT_PUBLIC_PRODUCTION_DEV_BASE_URL;

  const baseUrl = process.env.NODE_ENV === 'production' ? production : local;

  if (!baseUrl) {
    throw new Error(
      `Missing ${
        process.env.NODE_ENV === 'production' ? 'NEXT_PUBLIC_PRODUCTION_DEV_BASE_URL' : 'NEXT_PUBLIC_LOCAL_DEV_BASE_URL'
      } environment variable.`
    );
  }

  return baseUrl.replace(/\/+$/, '');
};

export const apiEndpoints: EndpointDefinitions = endpoints;
export { getBaseUrl };
