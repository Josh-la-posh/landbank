// Authentication utilities for consistent token and user management

export interface AuthUser {
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
}

// Token key - use consistent key throughout the app
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  // Also remove the legacy key if it exists
  localStorage.removeItem('accessToken');
}

/**
 * Get the authenticated user from localStorage
 */
export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Set the authenticated user in localStorage
 */
export function setAuthUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove the authenticated user from localStorage
 */
export function removeAuthUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuth(): void {
  removeAuthToken();
  removeAuthUser();
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): string | undefined {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : undefined;
}
