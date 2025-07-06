
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
  const token = localStorage.getItem('access_token');
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
  register: (email: string, password: string, username?: string) => apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  }),
  refreshToken: (refresh: string) => apiCall('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }),
};
