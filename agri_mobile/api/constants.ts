// API Configuration Constants

const SERVER_URL = 'http://192.168.254.223:8089'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  LOAN: {
    ALL: '/loans',
    CURRENT: '/loans/current',
    APPLY: '/loans/apply',
    PRODUCT: `/loan-products`,
    ANALYTICS: `/loans/analytics`,
    PAYMENT: '/loans/payment',
  },
  PROJECT: {
    ALL: '/projects',
    DASHBOARD: '/projects/dashboard',
    CREATE: '/projects',
    BY_ID: (id: string | number) => `/projects/${id}`,
    UPDATE: (id: string | number) => `/projects/${id}`,
    DELETE: (id: string | number) => `/projects/${id}`,
    ANALYTICS: '/projects/analytics',
    GOAL: {
      CREATE: '/projects/goal',
    },
    TASK: { 
      CREATE: '/projects/task',
      DONE: (id: string) => `/projects/task/done/${id}`
    }
  }, // Worker Management
  WORKERS: {
    ALL: '/workers',
    CREATE: '/workers',
    BY_ID: (id: string) => `workers/${id}`,
    UPDATE: (id: string) => `/workers/${id}`,
    DELETE: (id: string) => `/workers/${id}`,
  },

  ADMIN: {
    // User Management
    USER: {
      ALL: '/admin/users',
      CREATE: '/admin/users',
    },

    // Loan Management
    LOAN: {
      ALL: '/admin/loans',
      APPROVE: (id: string) => `/admin/loans/approve/${id}`,
      REJECT: (id: string) => `/admin/loans/reject/${id}`,
      STATS: '/admin/loans/stats',
      APPROVED:`/admin/loans/approved`,
      UNAPPROVED: '/admin/loans/unapproved',
      UPDATE_STATUS: (id: string) => `/admin/loans/update-status/${id}`,
      BY_ID:(id:string)=>`/admin/loans/${id}`
    },

    // Loan Product Management
    LOAN_PRODUCT: {
      ALL: '/admin/loan-products',
      BY_ID: (id: string) => `/admin/loan-products/${id}`,
      CREATE: '/admin/loan-products',
      UPDATE: (id: string) => `/admin/loan-products/${id}`,
      DELETE: (id: string) => `/admin/loan-products/${id}`,
    },



    // Project Management
    PROJECT: {
      ALL: '/admin/projects',
      ANALYTICS: '/admin/projects/analytics',
      BY_ID: (id: string) => `/admin/projects/${id}`,
      STATS: '/admin/projects/stats',
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
}