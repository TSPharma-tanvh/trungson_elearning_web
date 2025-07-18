import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    key: 'management',
    title: 'Management',
    icon: 'userManager',
    items: [
      { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
      { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
      { key: 'roles', title: 'Roles', href: paths.dashboard.roles, icon: 'roles' },
      { key: 'employee', title: 'Employee', href: paths.dashboard.employee, icon: 'employee' },
      { key: 'category', title: 'Category', href: paths.dashboard.category, icon: 'category' },
      { key: 'criteria', title: 'Enrollment Criteria', href: paths.dashboard.criteria, icon: 'criteria' },
    ],
  },
  {
    key: 'courses',
    title: 'Courses',
    icon: 'book',
    items: [
      { key: 'path', title: 'Path', href: paths.dashboard.path, icon: 'path' },
      { key: 'courses', title: 'Courses', href: paths.dashboard.courses, icon: 'course' },
      { key: 'lesson', title: 'Lesson', href: paths.dashboard.lesson, icon: 'lesson' },
    ],
  },
  {
    key: 'class',
    title: 'Class',
    icon: 'class',
    items: [
      { key: 'class', title: 'Class', href: paths.dashboard.class, icon: 'chalkboard-simple' },
      { key: 'teacher', title: 'Teacher', href: paths.dashboard.teacher, icon: 'teacher' },
      { key: 'attendance', title: 'Attendance', href: paths.dashboard.attendance, icon: 'student' },
    ],
  },
  {
    key: 'quiz',
    title: 'Quiz',
    icon: 'test',
    items: [
      { key: 'quiz', title: 'Quiz', href: paths.dashboard.quiz, icon: 'quiz' },
      { key: 'question', title: 'Question', href: paths.dashboard.question, icon: 'question' },
      { key: 'answers', title: 'Answers', href: paths.dashboard.answers, icon: 'answer' },
      { key: 'form', title: 'Form', href: paths.dashboard.form, icon: 'form' },
    ],
  },
  {
    key: 'progress',
    title: 'Progress',
    icon: 'progress',
    items: [
      { key: 'pathProgress', title: 'User Path Progress', href: paths.dashboard.userPathProgress, icon: 'userPath' },
      {
        key: 'courseProgress',
        title: 'User Course Progress',
        href: paths.dashboard.userCourseProgress,
        icon: 'userCourse',
      },
      {
        key: 'lessonProgress',
        title: 'User Lesson Progress',
        href: paths.dashboard.userLessonProgress,
        icon: 'userLesson',
      },
      {
        key: 'classProgress',
        title: 'User Class Progress',
        href: paths.dashboard.userClassProgress,
        icon: 'userClass',
      },
      {
        key: 'quizProgress',
        title: 'User Quiz Progress',
        href: paths.dashboard.userQuizProgress,
        icon: 'userQuiz',
      },
    ],
  },
  {
    key: 'system',
    title: 'System',
    icon: 'setting',
    items: [
      { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
      { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
      { key: 'system', title: 'System', href: paths.dashboard.system, icon: 'system' },
    ],
  },
  {
    key: 'communication',
    title: 'Communication',
    icon: 'chat',

    items: [
      { key: 'email', title: 'Email', href: paths.dashboard.email, icon: 'email' },
      { key: 'notification', title: 'Notification', href: paths.dashboard.notification, icon: 'notification' },
    ],
  },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
