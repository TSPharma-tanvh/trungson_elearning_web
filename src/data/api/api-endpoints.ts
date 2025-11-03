import { getBaseUrl } from './base-endpoints';

// Define two types: one for static (string) and one for dynamic (function)
type StaticEndpoint = string;
type DynamicEndpoint = (...args: string[]) => string;

interface IdentityEndpoints {
  signIn: StaticEndpoint;
  signInHrm: StaticEndpoint;
  signUp: StaticEndpoint;
  forgotPassword: StaticEndpoint;
  changePassword: StaticEndpoint;
  signOut: StaticEndpoint;
}

interface TokenEndpoints {
  refreshToken: StaticEndpoint;
}

interface UserEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  update: DynamicEndpoint;
  delete: DynamicEndpoint;
  import: StaticEndpoint;
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
  create: StaticEndpoint;
  update: StaticEndpoint;
  delete: DynamicEndpoint;
}

interface EnrollmentCriteriaEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface CoursesEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface LessonsEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface ClassEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface ClassTeacherEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface QuizEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  createDetail: StaticEndpoint;
  createByExcel: StaticEndpoint;
  update: StaticEndpoint;
}
interface QuestionEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}

interface AnswerEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}
interface FileResourcesEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
}

interface EmployeeEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  getHrm: StaticEndpoint;
  syncHrm: StaticEndpoint;
  delete: DynamicEndpoint;
}

interface DepartmentEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  getHrm: StaticEndpoint;
  syncHrm: StaticEndpoint;
  delete: DynamicEndpoint;
}
interface UserPathProgressEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
  enroll: StaticEndpoint;
  delete: DynamicEndpoint;
}

interface UserCourseProgressEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
  enroll: StaticEndpoint;
  delete: DynamicEndpoint;
}

interface UserLessonProgressEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
}
interface UserQuizProgressEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
  live: StaticEndpoint;
}

interface UserAnswerProgressEndpoints {
  update: StaticEndpoint;
}
interface AttendanceRecordsEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  create: StaticEndpoint;
  update: StaticEndpoint;
  delete: DynamicEndpoint;
  enroll: StaticEndpoint;
}

interface UserDevicesEndpoints {
  getAll: StaticEndpoint;
  getById: DynamicEndpoint;
  update: StaticEndpoint;
  delete: StaticEndpoint;
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
  lessons: LessonsEndpoints;
  class: ClassEndpoints;
  classTeacher: ClassTeacherEndpoints;
  quiz: QuizEndpoints;
  questions: QuestionEndpoints;
  answers: AnswerEndpoints;
  fileResources: FileResourcesEndpoints;
  employee: EmployeeEndpoints;
  department: DepartmentEndpoints;
  userPathProgress: UserPathProgressEndpoints;
  userCourseProgress: UserCourseProgressEndpoints;
  userLessonProgress: UserLessonProgressEndpoints;
  userQuizProgress: UserQuizProgressEndpoints;
  userAnswerProgress: UserAnswerProgressEndpoints;
  attendanceRecords: AttendanceRecordsEndpoints;
  userDevices: UserDevicesEndpoints;
}

//endpoint values
const endpoints: EndpointDefinitions = {
  identity: {
    signIn: 'Identity/Login',
    signInHrm: 'Identity/LoginWithHrm',
    signUp: 'Identity/Register',
    forgotPassword: 'Auth/Forgot-password',
    changePassword: 'Identity/ChangePassword',
    signOut: 'Identity/Logout',
  },
  token: {
    refreshToken: 'Identity/RefreshToken',
  },
  user: {
    getAll: 'User/GetUsers',
    getById: (id: string) => `User/GetUserInfoById/${id}`,
    update: (id: string) => `User/UpdateUser/${id}`,
    delete: (id: string) => `User/DeleteUser/${id}`,
    import: 'User/ImportUsers',
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
    create: 'Category/CreateCategory',
    update: 'Category/UpdateCategory',
    delete: (id: string) => `Category/DeleteCategory/${id}`,
  },
  enrollment: {
    getAll: 'EnrollmentCriteria/GetEnrollmentCriteria',
    getById: (id: string) => `EnrollmentCriteria/GetEnrollmentCriteriaById/${id}`,
    create: 'EnrollmentCriteria/CreateEnrollmentCriteria',
    update: 'EnrollmentCriteria/UpdateEnrollmentCriteria',
  },
  courses: {
    getAll: 'Course/GetCourse',
    getById: (id: string) => `Course/GetCourseById/${id}`,
    create: 'Course/CreateCourse',
    update: 'Course/UpdateCourse',
  },
  lessons: {
    getAll: 'Lesson/GetLesson',
    getById: (id: string) => `Lesson/GetLessonById/${id}`,
    create: 'Lesson/CreateLesson',
    update: 'Lesson/UpdateLesson',
  },
  class: {
    getAll: 'Class/GetClass',
    getById: (id: string) => `Class/GetClassById/${id}`,
    create: 'Class/CreateClass',
    update: 'Class/UpdateClass',
  },
  classTeacher: {
    getAll: 'ClassTeacher/GetClassTeachers',
    getById: (id: string) => `ClassTeacher/GetClassTeacherById/${id}`,
    create: 'ClassTeacher/CreateClassTeacher',
    update: 'ClassTeacher/UpdateClassTeacher',
  },
  quiz: {
    getAll: 'Quiz/GetQuizzes',
    getById: (id: string) => `Quiz/GetQuizById/${id}`,
    create: 'Quiz/CreateQuiz',
    createDetail: 'Quiz/CreateQuizDetail',
    createByExcel: 'Quiz/CreateQuizFromExcel',
    update: 'Quiz/UpdateQuiz',
  },
  questions: {
    getAll: 'Question/GetQuestion',
    getById: (id: string) => `Question/GetQuestionById/${id}`,
    create: 'Question/CreateQuestion',
    update: 'Question/UpdateQuestion',
  },
  answers: {
    getAll: 'Answer/GetAnswer',
    getById: (id: string) => `Answer/GetAnswerById/${id}`,
    create: 'Answer/CreateAnswer',
    update: 'Answer/UpdateAnswer',
  },
  fileResources: {
    getAll: 'Resource/GetFileResources',
    getById: (id: string) => `Resource/GetFileResourcesById/${id}`,
  },
  employee: {
    getAll: 'Employee/GetEmployees',
    getById: (id: string) => `Employee/GetEmployeeInfoById/${id}`,
    getHrm: 'Employee/GetEmployeeFromHrm',
    syncHrm: 'Employee/SaveEmployeeFromHrm',
    delete: (id: string) => `Employee/DeleteEmployee/${id}`,
  },
  department: {
    getAll: 'Department/GetDepartments',
    getById: (id: string) => `Department/GetDepartmentInfoById/${id}`,
    getHrm: 'Department/GetDepartmentFromHrm',
    syncHrm: 'Department/GetDepartmentFromHrm',
    delete: (id: string) => `Department/DeleteDepartment/${id}`,
  },
  userPathProgress: {
    getAll: 'UserPathProgress/GetUserPathProgress',
    getById: (id: string) => `UserPathProgress/GetUserPathProgressById/${id}`,
    create: 'UserPathProgress/CreateUserPath',
    update: 'UserPathProgress/UpdateUserPath',
    enroll: 'UserPathProgress/EnrollUserListToPath',
    delete: (id: string) => `UserPathProgress/DeleteUserPath/${id}`,
  },
  userCourseProgress: {
    getAll: 'UserCourseProgress/GetUserCourseProgress',
    getById: (id: string) => `UserCourseProgress/GetUserCourseProgressById/${id}`,
    create: 'UserCourseProgress/CreateUserCourse',
    update: 'UserCourseProgress/UpdateUserCourse',
    enroll: 'UserCourseProgress/EnrollUserListToCourse',
    delete: (id: string) => `UserCourseProgress/DeleteUserCourse/${id}`,
  },
  userLessonProgress: {
    getAll: 'UserLessonProgress/GetUserLessonProgress',
    getById: (id: string) => `UserLessonProgress/GetUserLessonProgressById/${id}`,
    create: 'UserLessonProgress/CreateUserLesson',
    update: 'UserLessonProgress/UpdateUserLesson',
  },
  userQuizProgress: {
    getAll: 'UserQuizProgress/GetUserQuizProgress',
    getById: (id: string) => `UserQuizProgress/GetUserQuizProgressById/${id}`,
    create: 'UserQuizProgress/AssignUsers',
    update: 'UserQuizProgress/UpdateProgress',
    live: 'UserQuizProgress/GetUserQuizLiveStatus',
  },
  userAnswerProgress: {
    update: 'UserAnswer/UpdateAnswers',
  },
  attendanceRecords: {
    getAll: 'AttendanceRecords/GetAttendanceRecords',
    getById: (id: string) => `AttendanceRecords/GetAttendanceRecordsById/${id}`,
    create: 'AttendanceRecords/CreateAttendanceRecords',
    update: 'AttendanceRecords/UpdateAttendanceRecords',
    delete: (id: string) => `AttendanceRecords/DeleteAttendanceRecords/${id}`,
    enroll: 'Class/EnrollUserListToClass',
  },
  userDevices: {
    getAll: 'UserDevices/GetUserDevices',
    getById: (id: string) => `UserDevices/GetUserDevicesById/${id}`,
    update: 'UserDevices/UpdateUserDevices',
    delete: 'UserDevices/DeleteUserDevices',
  },
};

export const apiEndpoints: EndpointDefinitions = endpoints;
export { getBaseUrl };
