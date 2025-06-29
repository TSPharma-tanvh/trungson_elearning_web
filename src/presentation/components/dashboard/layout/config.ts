// import type { NavItemConfig } from '@/types/nav';
// import { paths } from '@/paths';

// export const navItems = [
//   { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
//   { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
//   { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
//   { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
//   { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
//   { key: 'class', title: 'Class', href: paths.dashboard.class, icon: 'chalkboard-simple' },
//   { key: 'quiz', title: 'Quiz', href: paths.dashboard.quiz, icon: 'quiz' },
//   { key: 'question', title: 'Question', href: paths.dashboard.question, icon: 'question' },
//   { key: 'form', title: 'Form', href: paths.dashboard.form, icon: 'form' },
//   { key: 'system', title: 'System', href: paths.dashboard.system, icon: 'system' },
//   { key: 'email', title: 'Email', href: paths.dashboard.email, icon: 'email' },
//   { key: 'notification', title: 'Notification', href: paths.dashboard.notification, icon: 'notification' },
//   { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
//   { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
// ] satisfies NavItemConfig[];
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    key: 'management',
    title: 'Management',
    items: [
      { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
      { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
    ],
  },
  {
    key: 'content',
    title: 'Content',
    items: [
      { key: 'class', title: 'Class', href: paths.dashboard.class, icon: 'chalkboard-simple' },
      { key: 'quiz', title: 'Quiz', href: paths.dashboard.quiz, icon: 'quiz' },
      { key: 'question', title: 'Question', href: paths.dashboard.question, icon: 'question' },
      { key: 'form', title: 'Form', href: paths.dashboard.form, icon: 'form' },
    ],
  },
  {
    key: 'system',
    title: 'System',
    items: [
      { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
      { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
      { key: 'system', title: 'System', href: paths.dashboard.system, icon: 'system' },
    ],
  },
  {
    key: 'communication',
    title: 'Communication',
    items: [
      { key: 'email', title: 'Email', href: paths.dashboard.email, icon: 'email' },
      { key: 'notification', title: 'Notification', href: paths.dashboard.notification, icon: 'notification' },
    ],
  },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
