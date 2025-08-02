// API Configuration Constants

const SERVER_URL = 'http://192.168.50.223:8089'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_USER: '/auth/check-user',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    ALL: '/user/all',
    PROFILE: (fileName: string) => `/profile/${fileName}`,
    UPDATE_PROFILE: (id: number) => `/user/profile/${id}`,
    GET_DATA: '/user',
    UPLOAD_AVATAR: '/upload/user',
    BY_ID: (id: number | string) => `/user/${id}`,
    UPDATE: '/user',
    EXPORT: '/user/export',
    DELETE: '/user'
  },
  LOAN: {
    HISTORY: '/loans/history',
    CURRENT: '/loans/current',
    APPLY: '/loans/apply',
    PRODUCT: `/loan-products`,
    ANALYTICS: `/loans/analytics`,
    PAYMENTS: '/loans/payments',
  },
  PROJECT: {
    LIST: '/projects',
    CREATE: '/projects',
    BY_ID: (id: string | number) => `/projects/${id}`,
    UPDATE: (id: string | number) => `/projects/${id}`,
    DELETE: (id: string | number) => `/projects/${id}`,
    ANALYTICS: '/projects/analytics',
    GOAL: {
      CREATE: '/projects/goal',
    },
    TASK:{
      CREATE:'projects/task'
    }
  },

  ADMIN: {
    // User Management
    USER: {
      BASE: '/admin/users',
      ALL: '/admin/users',
      CREATE: '/admin/users',
      ROLES: '/admin/roles',
    },

    // Role Management
    ROLE: {
      ALL: '/admin/roles',
      PERMISSIONS: '/admin/roles/permissions',
    },

    // Loan Management
    LOAN: {
      BASE: '/admin/loans',
      ALL: '/admin/loans',
      APPROVE: '/admin/loans/approve',
      REJECT: '/admin/loans/reject',
      STATS: '/admin/loans/stats',
    },

    // Project Management
    PROJECT: {
      BASE: '/admin/projects',
      ALL: '/admin/projects',
      ANALYTICS: '/admin/projects/analytics',
    },

    // Dashboard
    DASHBOARD: {
      BASE: '/admin/dashboard',
      STATS: '/admin/dashboard/stats',
      ACTIVITIES: '/admin/dashboard/activities',
    }
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
