
const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your actual API URL

// Types for API responses
export interface User {
  id: number;
  email: string;
  username?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  published: boolean;
  images: Array<{ image: string }>;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  images: Array<{ image: string }>;
}

export interface Service {
  id: number;
  name: string;
  description: string;
}

export interface BloodInventory {
  id: number;
  group: string;
  available: boolean;
}

export interface VaccineInventory {
  id: number;
  type: string;
  available: boolean;
}

export interface BloodRequest {
  id: number;
  user: User;
  blood_group: string;
  location: string;
  contact: string;
  date_required: string;
}

export interface BloodDonationInterest {
  id: number;
  user: User;
  blood_group: string;
  available_date: string;
  contact_info: string;
}

// Auth token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ access: string; refresh: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setAuthToken(response.access);
    localStorage.setItem('refresh_token', response.refresh);
    return response;
  },

  register: async (email: string, password: string, username?: string) => {
    return apiRequest<User>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await apiRequest<{ access: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    setAuthToken(response.access);
    return response;
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ detail: string }>('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Blog APIs
export const blogAPI = {
  getBlogs: () => apiRequest<Blog[]>('/blogs/'),
  getBlog: (slug: string) => apiRequest<Blog>(`/blogs/${slug}/`),
  addComment: (blogId: number, comment: string) => {
    return apiRequest(`/blogs/${blogId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  },
};

// Event APIs
export const eventAPI = {
  getEvents: () => apiRequest<Event[]>('/events/'),
  getEvent: (id: number) => apiRequest<Event>(`/events/${id}/`),
};

// Service APIs
export const serviceAPI = {
  getServices: () => apiRequest<Service[]>('/services/'),
};

// Blood Inventory APIs
export const bloodInventoryAPI = {
  getBloodInventory: () => apiRequest<BloodInventory[]>('/blood-inventory/'),
};

// Vaccine Inventory APIs
export const vaccineInventoryAPI = {
  getVaccineInventory: () => apiRequest<VaccineInventory[]>('/vaccine-inventory/'),
};

// Blood Request APIs
export const bloodRequestAPI = {
  createBloodRequest: (data: {
    blood_group: string;
    location: string;
    contact: string;
    date_required: string;
  }) => {
    return apiRequest<BloodRequest>('/request-blood/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Blood Donation Interest APIs
export const bloodDonationAPI = {
  createDonationInterest: (data: {
    blood_group: string;
    available_date: string;
    contact_info: string;
  }) => {
    return apiRequest<BloodDonationInterest>('/donate-interest/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
