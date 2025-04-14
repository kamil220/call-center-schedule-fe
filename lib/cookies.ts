import { User } from '@/types/user';

// Define cookie keys
export const AUTH_TOKEN_COOKIE = 'auth_token';
export const USER_COOKIE = 'user_data';

/**
 * Sets an HTTP-only cookie
 */
export function setCookie(name: string, value: string, days = 7): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Gets a cookie by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameWithEquals = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameWithEquals) === 0) {
      return cookie.substring(nameWithEquals.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Removes a cookie by setting its expiration date to the past
 */
export function removeCookie(name: string): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
}

/**
 * Sets authentication cookies
 */
export function setAuthCookies(token: string, user: User): void {
  setCookie(AUTH_TOKEN_COOKIE, token);
  setCookie(USER_COOKIE, JSON.stringify(user));
}

/**
 * Gets user data from cookies
 */
export function getUserFromCookies(): User | null {
  const userData = getCookie(USER_COOKIE);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
}

/**
 * Gets token from cookies
 */
export function getTokenFromCookies(): string | null {
  return getCookie(AUTH_TOKEN_COOKIE);
}

/**
 * Clears all authentication cookies
 */
export function clearAuthCookies(): void {
  removeCookie(AUTH_TOKEN_COOKIE);
  removeCookie(USER_COOKIE);
} 