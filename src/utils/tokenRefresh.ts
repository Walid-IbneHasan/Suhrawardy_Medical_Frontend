import { authAPI } from './api';
import { authUtils, AuthTokens } from './auth';

// State to track ongoing refresh
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const setupTokenRefresh = () => {
  const originalFetch = window.fetch;

  window.fetch = async (url: string | Request, options?: RequestInit) => {
    let response = await originalFetch(url, options);

    // Skip token refresh for auth endpoints to avoid infinite loops
    const urlStr = url.toString();
    if (
      urlStr.includes('/auth/login/') ||
      urlStr.includes('/auth/register/') ||
      urlStr.includes('/auth/token/refresh/')
    ) {
      return response;
    }

    // Handle 401 errors
    if (response.status === 401 && authUtils.getRefreshToken()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = authUtils.getRefreshToken()!;
          const newTokens = await authAPI.refreshToken(refreshToken) as AuthTokens;

          // Update both access and refresh tokens (handles rotation)
          authUtils.setTokens({
            access: newTokens.access,
            refresh: newTokens.refresh || refreshToken, // Fallback to existing refresh if not rotated
          });

          // Notify subscribers with new access token
          onRefreshed(newTokens.access);
        } catch (error) {
          // Refresh failed, logout and redirect
          authUtils.logout();
          window.location.href = '/login';
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      // Wait for refresh to complete and retry with new token
      const newAccessToken = await new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve);
      });

      const newHeaders = {
        ...options?.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await originalFetch(url, {
        ...options,
        headers: newHeaders,
      });
    }

    return response;
  };
};

// Call this in app initialization
export const initializeTokenRefresh = () => {
  setupTokenRefresh();
};