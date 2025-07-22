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

export interface About {
  id: number;
  title: string;
  description: string;
  years_experience: number;
  patients_served: string;
  satisfaction_rate: string;
  image?: string;
  images?: { id: number; image: string }[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
  images: { image: string }[];
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
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
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Omit Content-Type for FormData to let the browser set multipart/form-data with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Accept 204 No Content as success for DELETE requests
  if (!response.ok && !(options.method === 'DELETE' && response.status === 204)) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  // For DELETE requests with 204, return an empty object
  if (options.method === 'DELETE' && response.status === 204) {
    return {} as T;
  }

  // Handle empty response body (e.g., 204 or no content)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
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

// About API
export const aboutAPI = {
  getAbout: (): Promise<About[]> => apiCall('/about/'),
  getAchievements: (): Promise<Achievement[]> => apiCall('/achievements/'),
  getTeamMembers: (): Promise<TeamMember[]> => apiCall('/team-members/'),
  getMission: (): Promise<Mission[]> => apiCall('/mission/'),
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
  // About
  about: {
    getAll: (): Promise<About[]> => apiCall('/admin/about/'),
    create: (data: FormData) => apiCall('/admin/about/', {
      method: 'POST',
      body: data,
    }),
    update: (id: number, data: FormData) => apiCall(`/admin/about/${id}/`, {
      method: 'PATCH',
      body: data,
    }),
    delete: (id: number) => apiCall(`/admin/about/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Achievements
  achievements: {
    getAll: (): Promise<Achievement[]> => apiCall('/admin/achievements/'),
    create: (data: { title: string; description: string; icon: string }) => apiCall('/admin/achievements/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { title: string; description: string; icon: string }) => apiCall(`/admin/achievements/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/achievements/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Team Members
  teamMembers: {
    getAll: (): Promise<TeamMember[]> => apiCall('/admin/team-members/'),
    create: (data: FormData) => apiCall('/admin/team-members/', {
      method: 'POST',
      body: data,
    }),
    update: (id: number, data: FormData) => apiCall(`/admin/team-members/${id}/`, {
      method: 'PATCH',
      body: data,
    }),
    delete: (id: number) => apiCall(`/admin/team-members/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Mission
  mission: {
    getAll: (): Promise<Mission[]> => apiCall('/admin/mission/'),
    create: (data: { title: string; description: string; phone: string; email: string; address: string }) => apiCall('/admin/mission/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { title: string; description: string; phone: string; email: string; address: string }) => apiCall(`/admin/mission/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/mission/${id}/`, {
      method: 'DELETE',
    }),
  },
};