import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    key: 'management',
    title: 'management',
    icon: 'userManager',
    items: [
      // { key: 'customers', title: 'customers', href: paths.dashboard.customers, icon: 'users' },
      { key: 'users', title: 'users', href: paths.dashboard.users, icon: 'users' },
      { key: 'roles', title: 'roles', href: paths.dashboard.roles, icon: 'roles' },
      { key: 'employee', title: 'employee', href: paths.dashboard.employee, icon: 'employee' },
      { key: 'category', title: 'category', href: paths.dashboard.category, icon: 'category' },
      { key: 'criteria', title: 'criteria', href: paths.dashboard.criteria, icon: 'criteria' },
      { key: 'devices', title: 'devices', href: paths.dashboard.devices, icon: 'devices' },
    ],
  },
  {
    key: 'class',
    title: 'class',
    icon: 'class',
    items: [
      { key: 'class', title: 'class', href: paths.dashboard.class, icon: 'chalkboard-simple' },
      { key: 'teacher', title: 'teacher', href: paths.dashboard.teacher, icon: 'teacher' },
      { key: 'attendance', title: 'attendance', href: paths.dashboard.attendance, icon: 'student' },
    ],
  },
  {
    key: 'courses',
    title: 'courses',
    icon: 'book',
    items: [
      { key: 'path', title: 'path', href: paths.dashboard.path, icon: 'path' },
      { key: 'courses', title: 'courses', href: paths.dashboard.courses, icon: 'course' },
      { key: 'lesson', title: 'lesson', href: paths.dashboard.lesson, icon: 'lesson' },
    ],
  },
  {
    key: 'quiz',
    title: 'quiz',
    icon: 'test',
    items: [
      { key: 'quiz', title: 'quiz', href: paths.dashboard.quiz, icon: 'quiz' },
      { key: 'question', title: 'question', href: paths.dashboard.question, icon: 'question' },
      { key: 'answers', title: 'answers', href: paths.dashboard.answers, icon: 'answer' },
      // { key: 'form', title: 'form', href: paths.dashboard.form, icon: 'form' },
    ],
  },
  {
    key: 'progress',
    title: 'progress',
    icon: 'progress',
    items: [
      { key: 'pathProgress', title: 'userPathProgress', href: paths.dashboard.userPathProgress, icon: 'userPath' },
      {
        key: 'courseProgress',
        title: 'userCourseProgress',
        href: paths.dashboard.userCourseProgress,
        icon: 'userCourse',
      },
      {
        key: 'lessonProgress',
        title: 'userLessonProgress',
        href: paths.dashboard.userLessonProgress,
        icon: 'userLesson',
      },
      { key: 'quizProgress', title: 'userQuizProgress', href: paths.dashboard.userQuizProgress, icon: 'userQuiz' },
      {
        key: 'liveQuizTracking',
        title: 'liveQuizTracking',
        href: paths.dashboard.liveQuizTracking,
        icon: 'liveQuizTracking',
      },
    ],
  },

  {
    key: 'system',
    title: 'system',
    icon: 'setting',
    items: [
      // { key: 'integrations', title: 'integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
      // { key: 'settings', title: 'settings', href: paths.dashboard.settings, icon: 'gear-six' },
      // { key: 'system', title: 'system', href: paths.dashboard.system, icon: 'system' },
      { key: 'account', title: 'account', href: paths.dashboard.account, icon: 'user' },
      // { key: 'email', title: 'email', href: paths.dashboard.email, icon: 'email' },
      // { key: 'notification', title: 'notification', href: paths.dashboard.notification, icon: 'notification' },
    ],
  },

  // { key: 'error', title: 'error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
