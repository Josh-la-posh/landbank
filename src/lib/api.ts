// API configuration and helper functions

const DEFAULT_API_BASE = 'https://landbank-ef9x.onrender.com/api';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '');

const withBase = (endpoint: string) =>
  `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

const isFormDataBody = (body: RequestInit['body']): body is FormData =>
  typeof FormData !== 'undefined' && body instanceof FormData;

const buildQueryString = (params?: Record<string, string | number | boolean | undefined | null>) => {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
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
    const isFormData = isFormDataBody(options.body ?? null);
    const mergedHeaders = new Headers();

    Object.entries(defaultHeaders).forEach(([key, value]) => {
      mergedHeaders.set(key, value);
    });

    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => mergedHeaders.set(key, value));
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => mergedHeaders.set(key, value));
    } else if (options.headers && typeof options.headers === 'object') {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        mergedHeaders.set(key, value);
      });
    }

    if (isFormData) {
      mergedHeaders.delete('Content-Type');
    }

    const config: RequestInit = {
      method: 'GET',
      ...options,
      headers: mergedHeaders,
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

export interface GetAdsParams {
  merchantCode: string;
  adId?: string;
  pageNumber?: string | number;
  pageSize?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface BusinessProfile {
  dob: string | null;
  nationality: string | null;
  role: string | null;
  merchantCode: string;
  percentOfBusiness: number | null;
  identificationType: string | null;
  tradingName: string | null;
  businessDescription: string | null;
  identityNumber: string | null;
  merchantAddress: string | null;
  rcNumber: string | null;
  legalBusinessName: string | null;
  countryCode: string | null;
  incorporationDate: string | null;
  businessCommencementDate: string | null;
  ownershipType: string | null;
  staffStrength: number | null;
  numberOfLocations: number | null;
  industry: string | null;
  industryCategory: string | null;
  website: string | null;
  disputeEmail: string | null;
  supportEmail: string | null;
  contactEmail: string | null;
  merchantAddressStatus: boolean | null;
  legalBusinessNameStatus: boolean | null;
  countryCodeStatus: boolean | null;
  industryStatus: boolean | null;
  industryCategoryStatus: boolean | null;
  rcNumberStatus: boolean | null;
  incorporationDateStatus: boolean | null;
  businessCommencementDateStatus: boolean | null;
  ownershipTypeStatus: boolean | null;
  staffStrengthStatus: boolean | null;
  numberOfLocationsStatus: boolean | null;
  websiteStatus: boolean | null;
  ads: unknown[] | null;
  status: boolean | null;
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

export const adsApi = {
  create: (payload: FormData, token?: string) =>
    apiRequest<LandbankResponse<unknown>>('/ads', {
      method: 'POST',
      body: payload,
      headers: token ? { Authorization: token } : undefined,
    }),

  list: (params: GetAdsParams, token?: string) =>
    apiRequest<LandbankResponse<unknown>>(`/ads${buildQueryString(params)}`, token ? { headers: { Authorization: token } } : undefined),
};

export const userApi = {
  getBusinessProfile: (merchantCode: string, token?: string) =>
    apiRequest<LandbankResponse<BusinessProfile>>(
      `/user/business${buildQueryString({ merchantCode })}`,
      token
        ? {
            headers: {
              Authorization: token,
            },
          }
        : undefined
    ),
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
