
const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface Service {
  id: number;
  name: string;
  description: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  published: boolean;
  images: { image: string }[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  images: { image: string }[];
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

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  // Get token from cookie using js-cookie
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];
  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API call function
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Service API
export const serviceAPI = {
  getServices: (): Promise<Service[]> => apiCall('/services/'),
};

// Blog API
export const blogAPI = {
  getBlogs: (): Promise<Blog[]> => apiCall('/blogs/'),
  getBlog: (slug: string): Promise<Blog> => apiCall(`/blogs/${slug}/`),
};

// Event API
export const eventAPI = {
  getEvents: (): Promise<Event[]> => apiCall('/events/'),
  getEvent: (id: number): Promise<Event> => apiCall(`/events/${id}/`),
};

// Blood Inventory API
export const bloodAPI = {
  getBloodInventory: (): Promise<BloodInventory[]> => apiCall('/blood-inventory/'),
  requestBlood: (data: {
    blood_group: string;
    location: string;
    contact: string;
    date_required: string;
  }) => apiCall('/request-blood/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  donateInterest: (data: {
    blood_group: string;
    available_date: string;
    contact_info: string;
  }) => apiCall('/donate-interest/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Vaccine Inventory API
export const vaccineAPI = {
  getVaccineInventory: (): Promise<VaccineInventory[]> => apiCall('/vaccine-inventory/'),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) => apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (email: string, password: string, confirmPassword: string) => apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
  }),
  refreshToken: (refresh: string) => apiCall('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }),
  getUserProfile: () => apiCall('/auth/profile/'),
  changePassword: (data: {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }) => apiCall('/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  forgotPassword: (email: string) => apiCall('/auth/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (data: {
    token: string;
    new_password: string;
    confirm_new_password: string;
  }) => apiCall('/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Admin APIs
export const adminAPI = {
  // Services
  services: {
    getAll: (): Promise<Service[]> => apiCall('/admin/services/'),
    create: (data: { name: string; description: string }) => apiCall('/admin/services/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { name: string; description: string }) => apiCall(`/admin/services/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/services/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Blogs
  blogs: {
    getAll: (): Promise<Blog[]> => apiCall('/admin/blogs/'),
    create: (data: { title: string; slug: string; content: string; published: boolean }) => apiCall('/admin/blogs/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (slug: string, data: { title: string; slug: string; content: string; published: boolean }) => apiCall(`/admin/blogs/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (slug: string) => apiCall(`/admin/blogs/${slug}/`, {
      method: 'DELETE',
    }),
  },
  // Events
  events: {
    getAll: (): Promise<Event[]> => apiCall('/admin/events/'),
    create: (data: { title: string; description: string; location: string; date: string }) => apiCall('/admin/events/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { title: string; description: string; location: string; date: string }) => apiCall(`/admin/events/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/events/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Blood Inventory
  bloodInventory: {
    getAll: (): Promise<BloodInventory[]> => apiCall('/admin/blood-inventory/'),
    create: (data: { group: string; available: boolean }) => apiCall('/admin/blood-inventory/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { group: string; available: boolean }) => apiCall(`/admin/blood-inventory/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/blood-inventory/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Vaccine Inventory
  vaccineInventory: {
    getAll: (): Promise<VaccineInventory[]> => apiCall('/admin/vaccine-inventory/'),
    create: (data: { type: string; available: boolean }) => apiCall('/admin/vaccine-inventory/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { type: string; available: boolean }) => apiCall(`/admin/vaccine-inventory/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/vaccine-inventory/${id}/`, {
      method: 'DELETE',
    }),
  },
};
