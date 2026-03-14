import Cookies from 'js-cookie';

export interface User {
  id: number;
  email: string;
  username?: string;
  is_staff: boolean;
  is_superuser: boolean;
  role?: 'user' | 'moderator' | 'super_admin';
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh?: string; // Optional to handle cases where refresh isn't returned
}

// Cookie configuration
const COOKIE_CONFIG = {
  secure: window.location.protocol === "https:",
  sameSite: 'strict' as const,
  path: '/',
};

export const authUtils = {
  // Token management
  setTokens: (tokens: AuthTokens) => {
    Cookies.set('access_token', tokens.access, COOKIE_CONFIG);
    if (tokens.refresh) {
      Cookies.set('refresh_token', tokens.refresh, COOKIE_CONFIG);
    }
  },

  getAccessToken: (): string | undefined => {
    return Cookies.get('access_token');
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get('refresh_token');
  },

  clearTokens: () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
  },

  // User management
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  clearUser: () => {
    localStorage.removeItem('user');
  },

  // Authentication state
  isAuthenticated: (): boolean => {
    return !!authUtils.getAccessToken();
  },

  isAdmin: (): boolean => {
    const user = authUtils.getUser();
    return user?.is_staff || false;
  },

  // Logout
  logout: () => {
    authUtils.clearTokens();
    authUtils.clearUser();
  },
};
