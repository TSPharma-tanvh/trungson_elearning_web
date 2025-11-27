import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'overview', href: paths.dashboard.overview, icon: 'chart-pie' },

  {
    key: 'courses',
    title: 'courses',
    icon: 'book',
    items: [
      // { key: 'path', title: 'path', href: paths.dashboard.path, icon: 'path' },
      { key: 'courses', title: 'courses', href: paths.dashboard.courses, icon: 'course' },
      { key: 'lesson', title: 'lesson', href: paths.dashboard.lesson, icon: 'lesson' },
      {
        key: 'courseProgress',
        title: 'userCourseProgress',
        href: paths.dashboard.userCourseProgress,
        icon: 'userCourse',
      },
      {
        key: 'courseProgressCreate',
        title: 'enrollCourse',
        href: paths.dashboard.userCourseProgressCreate,
        icon: 'bookUser',
      },
    ],
  },
  {
    key: 'quiz',
    title: 'quiz',
    icon: 'test',
    items: [
      { key: 'quiz', title: 'quiz', href: paths.dashboard.quiz, icon: 'quiz' },
      { key: 'quizProgress', title: 'quizProgress', href: paths.dashboard.userQuizProgress, icon: 'userQuiz' },
    ],
  },
  {
    key: 'exam',
    title: 'exam',
    icon: 'exam',
    items: [
      { key: 'exam', title: 'exam', href: paths.dashboard.exam, icon: 'exam' },
      { key: 'userExamProgress', title: 'userExamProgress', href: paths.dashboard.userExamProgress, icon: 'userQuiz' },
      { key: 'examEnroll', title: 'examEnroll', href: paths.dashboard.examEnroll, icon: 'examEnroll' },
    ],
  },
  {
    key: 'questions',
    title: 'questions',
    icon: 'question',
    items: [
      { key: 'category', title: 'questionBank', href: paths.dashboard.questionCategory, icon: 'questionCategory' },
      { key: 'question', title: 'question', href: paths.dashboard.question, icon: 'question' },
      { key: 'answers', title: 'answers', href: paths.dashboard.answers, icon: 'answer' },
    ],
  },
  // {
  //   key: 'progress',
  //   title: 'progress',
  //   icon: 'progress',
  //   items: [
  //     // { key: 'pathProgress', title: 'userPathProgress', href: paths.dashboard.userPathProgress, icon: 'userPath' },
  //     // {
  //     //   key: 'courseProgress',
  //     //   title: 'userCourseProgress',
  //     //   href: paths.dashboard.userCourseProgress,
  //     //   icon: 'userCourse',
  //     // },
  //     // {
  //     //   key: 'lessonProgress',
  //     //   title: 'userLessonProgress',
  //     //   href: paths.dashboard.userLessonProgress,
  //     //   icon: 'userLesson',
  //     // },
  //     { key: 'quizProgress', title: 'userQuizProgress', href: paths.dashboard.userQuizProgress, icon: 'userQuiz' },
  //     {
  //       key: 'liveQuizTracking',
  //       title: 'liveQuizTracking',
  //       href: paths.dashboard.liveQuizTracking,
  //       icon: 'liveQuizTracking',
  //     },
  //   ],
  // },

  {
    key: 'class',
    title: 'class',
    icon: 'class',
    items: [
      { key: 'class', title: 'class', href: paths.dashboard.class, icon: 'chalkboard-simple' },
      { key: 'attendance', title: 'attendance', href: paths.dashboard.attendance, icon: 'student' },
    ],
  },
  {
    key: 'management',
    title: 'users',
    icon: 'userManager',
    items: [
      // { key: 'customers', title: 'customers', href: paths.dashboard.customers, icon: 'users' },
      { key: 'users', title: 'users', href: paths.dashboard.users, icon: 'users' },
      { key: 'roles', title: 'roles', href: paths.dashboard.roles, icon: 'roles' },
      { key: 'teacher', title: 'teacher', href: paths.dashboard.teacher, icon: 'teacher' },
      // { key: 'employee', title: 'employee', href: paths.dashboard.employee, icon: 'employee' },
    ],
  },
  {
    key: 'system',
    title: 'system',
    icon: 'setting',
    items: [
      // { key: 'integrations', title: 'integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
      // { key: 'system', title: 'system', href: paths.dashboard.system, icon: 'system' },
      // { key: 'account', title: 'account', href: paths.dashboard.account, icon: 'user' },
      { key: 'category', title: 'category', href: paths.dashboard.category, icon: 'category' },
      // { key: 'criteria', title: 'criteria', href: paths.dashboard.criteria, icon: 'criteria' },
      // { key: 'email', title: 'email', href: paths.dashboard.email, icon: 'email' },
      // { key: 'notification', title: 'notification', href: paths.dashboard.notification, icon: 'notification' },
      { key: 'resources', title: 'resources', href: paths.dashboard.resources, icon: 'files' },
      { key: 'devices', title: 'devices', href: paths.dashboard.devices, icon: 'devices' },
      { key: 'settings', title: 'settings', href: paths.dashboard.settings, icon: 'gear-six' },
    ],
  },

  // { key: 'error', title: 'error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
