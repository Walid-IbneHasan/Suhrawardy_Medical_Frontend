import { authAPI } from './api';
import { authUtils } from './auth';

// Token refresh interceptor
export const setupTokenRefresh = () => {
  const originalFetch = window.fetch;

  window.fetch = async (url: string | Request, options?: RequestInit) => {
    let response = await originalFetch(url, options);

    // If we get a 401 (unauthorized) and have a refresh token, try to refresh
    if (response.status === 401 && authUtils.getRefreshToken()) {
      try {
        const refreshToken = authUtils.getRefreshToken();
        if (refreshToken) {
          const newTokens = await authAPI.refreshToken(refreshToken) as { access: string };
          
          // Update the access token
          authUtils.setTokens({
            access: newTokens.access,
            refresh: refreshToken,
          });

          // Retry the original request with new token
          const newHeaders = {
            ...options?.headers,
            Authorization: `Bearer ${newTokens.access}`,
          };

          response = await originalFetch(url, {
            ...options,
            headers: newHeaders,
          });
        }
      } catch (error) {
        // If refresh fails, logout the user
        authUtils.logout();
        window.location.href = '/login';
      }
    }

    return response;
  };
};

// Call this function in your app initialization
export const initializeTokenRefresh = () => {
  setupTokenRefresh();
};