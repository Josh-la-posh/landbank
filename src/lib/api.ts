// API configuration and helper functions

const DEFAULT_API_BASE = 'https://landbank-ef9x.onrender.com/api';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '');

const withBase = (endpoint: string) =>
  `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export interface LandbankResponse<T> {
  requestSuccessful: boolean;
  responseData: T | null;
  message: string;
  responseCode: string;
}

interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const config: RequestInit = {
      method: 'GET',
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    const response = await fetch(withBase(endpoint), config);
    const data = await response
      .json()
      .catch(() => null);

    return {
      data,
      error: response.ok ? undefined : (data?.message || response.statusText),
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  tokenType: string;
  accessToken: string;
  expiresIn: string;
  user: {
    id: string;
    isActive: boolean;
    createdDate: unknown;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userCode: string;
    isEmailConfirmed: boolean;
    emailConfirmationDate: string | null;
  };
}

export interface SignupPayload {
  country: string;
  contactEmail: string;
  contactPhoneNumber: string;
  contactFirstName: string;
  contactLastName: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ConfirmAccountPayload extends ResetPasswordPayload {}

export interface ResendConfirmationPayload {
  email: string;
}

// Auth API functions
export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<LandbankResponse<LoginResponseData>>('/Auth', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupPayload) =>
    apiRequest<LandbankResponse<unknown>>('/Auth', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiRequest<LandbankResponse<null>>('/Account/forget-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiRequest<LandbankResponse<null>>('/Account/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resendConfirmation: (payload: ResendConfirmationPayload) =>
    apiRequest<LandbankResponse<null>>('/Account/resend-confirm-account', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  confirmAccount: (payload: ConfirmAccountPayload) =>
    apiRequest<LandbankResponse<null>>('/Auth/confirm-account', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    apiRequest<LandbankResponse<null>>('/Account/logout', {
      method: 'PUT',
    }),
};

// Land API functions
export const landApi = {
  getAll: async (params?: { location?: string; minPrice?: number; maxPrice?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/land${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/land/${id}`);
  },

  create: async (landData: any) => {
    return apiRequest('/land', {
      method: 'POST',
      body: JSON.stringify(landData),
    });
  },

  update: async (id: string, landData: any) => {
    return apiRequest(`/land/${id}`, {
      method: 'PUT',
      body: JSON.stringify(landData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/land/${id}`, {
      method: 'DELETE',
    });
  },
};
