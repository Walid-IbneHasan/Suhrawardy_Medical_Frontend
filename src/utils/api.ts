// lib/api.ts

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
  is_active: boolean;  
  images: { image: string }[];
}

export interface BloodInventory {
  id: number;
  group: string;
  available: boolean;
}

export interface BloodRequest {
  id: number;
  user?: { email: string; name:string; };
  blood_group: string;
  location: string;
  contact: string;
  date_required: string;
  collection_location?: string; 
  reason?:string;
}

export interface BloodDonationInterest {
  id: number;
  user?: { email: string; name:string; };
  blood_group: string;
  available_date: string;
  contact_info: string;
}
export interface Donation {
  id: number;
  user?: { email: string; name:string; };
  blood_group: string;
  donation_date: string;
  contact_info: string;
  notes: string;
  created_at: string;
}

export interface BloodDonor {
  id: number;
  name: string;
  batch: string;
  blood_group: string;
  phone: string;
  last_donated_date: string | null;
  gender: "Male" | "Female" | "Other";
}

export interface PDFDocument {
  id: number;
  description: string;
  file: string; 
  created_at: string;
  updated_at: string;
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
export interface HomeAbout {
  id: number;
  title: string;
  description: string;
  years_experience: number;
  patients_served: string;
  satisfaction_rate: string;
}

export interface MissionStatement {
  id: number;
  statement: string;
}

export interface HomeAboutAchievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}
export interface User {
  id: number;
  email: string;
  username: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

// (near the top with other interfaces)
export interface UserProfile {
  id: number;
  email: string;
  username: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  blood_group: string;
  address: string;
  last_donation_date: string | null;
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

//Event API
export const eventAPI = {
  getEvents: (): Promise<Event[]> => apiCall('/events/'),                
  getEvent: (id: number): Promise<Event> => apiCall(`/events/${id}/`),

  // NEW: split lists
  getUpcoming: (): Promise<Event[]> => apiCall('/events/upcoming/'),
  getPast: (): Promise<Event[]> => apiCall('/events/past/'),
};

// Blood Inventory API
export const bloodAPI = {
  getBloodInventory: (): Promise<BloodInventory[]> => apiCall('/blood-inventory/'),
  requestBlood: (data: {
    blood_group: string;
    location: string;
    contact: string;
    date_required: string;
    collection_location?: string;
    reason?: string;
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

// User-scoped
export const meAPI = {
  myBloodRequests: (): Promise<BloodRequest[]> => apiCall('/my/blood-requests/'),
  myDonationInterests: (): Promise<BloodDonationInterest[]> => apiCall('/my/donation-interests/'),
  myDonations: (): Promise<Donation[]> => apiCall('/my/donations/'),
  createDonation: (data: { blood_group: string; donation_date: string; contact_info?: string; notes?: string }) =>
    apiCall('/my/donations/', { method: 'POST', body: JSON.stringify(data) }),
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
  getHomeAbout: (): Promise<HomeAbout[]> => apiCall('/home-about/'),
  getMissionStatement: (): Promise<MissionStatement[]> => apiCall('/mission-statement/'),
  getHomeAchievements: (): Promise<HomeAboutAchievement[]> => apiCall('/home-achievements/'),
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
  }) as Promise<{ access: string; refresh: string }>,
  getUserProfile: () => apiCall('/auth/profile/'),
  updateUserProfile: (data: Partial<Pick<UserProfile,
    'first_name' | 'last_name' | 'phone' | 'blood_group' | 'address' | 'last_donation_date'
  >>) => apiCall<UserProfile>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
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
    create: (data: FormData) =>
      apiCall("/admin/blogs/", {
        method: "POST",
        body: data,
      }),
    update: (slug: string, data: FormData) =>
      apiCall(`/admin/blogs/${slug}/`, {
        method: "PATCH",
        body: data,
      }),
    delete: (slug: string) =>
      apiCall(`/admin/blogs/${slug}/`, {
        method: "DELETE",
      }),
  },
  // Events
  events: {
    getAll: (): Promise<Event[]> => apiCall('/admin/events/'),
    create: (data: FormData) => apiCall('/admin/events/', {
      method: 'POST',
      body: data,
    }),
    update: (id: number, data: FormData) => apiCall(`/admin/events/${id}/`, {
      method: 'PATCH',
      body: data,
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
    // Blood Requests
    bloodRequests: {
      getAll: (): Promise<BloodRequest[]> => apiCall('/admin/blood-requests/'),
      create: (data: { blood_group: string; location: string; contact: string; date_required: string; collection_location?: string; reason?: string; }) => apiCall('/admin/blood-requests/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: (id: number, data: { blood_group: string; location: string; contact: string; date_required: string; collection_location?: string; reason?: string; }) => apiCall(`/admin/blood-requests/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      delete: (id: number) => apiCall(`/admin/blood-requests/${id}/`, {
        method: 'DELETE',
      }),
    },
    // Blood Donation Interests
    donationInterests: {
      getAll: (): Promise<BloodDonationInterest[]> => apiCall('/admin/donation-interests/'),
      create: (data: { blood_group: string; available_date: string; contact_info: string }) => apiCall('/admin/donation-interests/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: (id: number, data: { blood_group: string; available_date: string; contact_info: string }) => apiCall(`/admin/donation-interests/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      delete: (id: number) => apiCall('/admin/donation-interests/${id}/', {
        method: 'DELETE',
      }),
    },

    donations: {
      getAll: (): Promise<Donation[]> => apiCall('/admin/donations/'),
      create: (data: { blood_group: string; donation_date: string; contact_info?: string; notes?: string }) =>
        apiCall('/admin/donations/', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: Partial<{ blood_group: string; donation_date: string; contact_info: string; notes: string }>) =>
        apiCall(`/admin/donations/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: number) => apiCall(`/admin/donations/${id}/`, { method: 'DELETE' }),
    },

    donors: {
      getAll: (): Promise<BloodDonor[]> => apiCall('/admin/donors/'),
      create: (data: Omit<BloodDonor, 'id'>) => apiCall('/admin/donors/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      update: (id: number, data: Omit<BloodDonor, 'id'>) => apiCall(`/admin/donors/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      delete: (id: number) => apiCall(`/admin/donors/${id}/`, {
        method: 'DELETE',
      }),
    },
    pdfDocuments: {
      getAll: (): Promise<PDFDocument[]> => apiCall('/admin/pdfs/'),
      create: (data: FormData): Promise<PDFDocument> => apiCall('/admin/pdfs/', {
        method: 'POST',
        body: data,
      }),
      delete: (id: number) => apiCall(`/admin/pdfs/${id}/`, {
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
  // Home About
  homeAbout: {
    getAll: (): Promise<HomeAbout[]> => apiCall('/admin/home-about/'),
    create: (data: { title: string; description: string; years_experience: number; patients_served: string; satisfaction_rate: string }) => apiCall('/admin/home-about/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { title: string; description: string; years_experience: number; patients_served: string; satisfaction_rate: string }) => apiCall(`/admin/home-about/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/home-about/${id}/`, {
      method: 'DELETE',
    }),
  },
  // Mission Statement
  missionStatement: {
    getAll: (): Promise<MissionStatement[]> => apiCall('/admin/mission-statement/'),
    create: (data: { statement: string }) => apiCall('/admin/mission-statement/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { statement: string }) => apiCall(`/admin/mission-statement/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall('/admin/mission-statement/${id}/', {
      method: 'DELETE',
    }),
  },
  // Home About Achievements
  homeAchievements: {
    getAll: (): Promise<HomeAboutAchievement[]> => apiCall('/admin/home-achievements/'),
    create: (data: { title: string; description: string; icon: string }) => apiCall('/admin/home-achievements/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: { title: string; description: string; icon: string }) => apiCall(`/admin/home-achievements/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall('/admin/home-achievements/${id}/', {
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
    delete: (id: number) => apiCall('/admin/about/${id}/', {
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
    delete: (id: number) => apiCall('/admin/achievements/${id}/', {
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
    delete: (id: number) => apiCall('/admin/team-members/${id}/', {
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
    delete: (id: number) => apiCall('/admin/mission/${id}/', {
      method: 'DELETE',
    }),
  },
  // Users
  users: {
    getAll: (): Promise<User[]> => apiCall('/admin/users/'),
    create: (data: {
      email: string;
      password: string;
      confirm_password: string;
      username?: string;
      is_staff: boolean;
      is_superuser: boolean;
    }) => apiCall('/admin/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiCall(`/admin/users/${id}/`, {
      method: 'DELETE',
    }),
  },
};
