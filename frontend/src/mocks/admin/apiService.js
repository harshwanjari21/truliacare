// API Service to connect to Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const text = await response.text();
  
  if (!response.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { message: text || 'Network error' };
    }
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// Helper function to make API calls with error handling
const apiCall = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth service
export const authService = {
  async login(credentials) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return { success: true };
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Events service
export const eventsService = {
  async getEvents(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return apiCall(`/events?${params}`);
  },

  async getEvent(id) {
    return apiCall(`/events/${id}`);
  },

  async createEvent(eventData) {
    return apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id, eventData) {
    return apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id) {
    return apiCall(`/events/${id}`, {
      method: 'DELETE',
    });
  }
};

// Bookings service
export const bookingsService = {
  async getBookings(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return apiCall(`/bookings?${params}`);
  }
};

// Users service
export const usersService = {
  async getUsers(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return apiCall(`/users?${params}`);
  }
};

// Dashboard service
export const dashboardService = {
  async fetchDashboardData() {
    return apiCall('/dashboard');
  }
};

// Categories service
export const categoriesService = {
  async getCategories() {
    return apiCall('/categories');
  }
};

// Combined export for backward compatibility
export default {
  authService,
  eventsService,
  bookingsService,
  usersService,
  dashboardService,
  categoriesService
};