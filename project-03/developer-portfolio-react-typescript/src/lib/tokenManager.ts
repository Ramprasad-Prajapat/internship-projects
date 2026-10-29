// src/lib/tokenManager.ts
/**
 * Simple token manager for frontend.
 * Stores access and refresh tokens in localStorage.
 * In production, you may replace this with more secure storage.
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export const removeAccessToken = () => {
  localStorage.removeItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem('refresh_token', token);
};

export const removeRefreshToken = () => {
  localStorage.removeItem('refresh_token');
};

/**
 * Simulated refresh token call – replace with real API endpoint later.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  // Placeholder: in real scenario call `/auth/refresh`
  // Here we just return the same token after a delay to satisfy type checks.
  return new Promise((resolve) => {
    setTimeout(() => resolve(refreshToken), 500);
  });
};
