import { mockEvents, mockBookings, mockUsers, mockRecentActivity } from './mockData.js';

// Simulate network delay
const delay = (min = 200, max = 800) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// Simulate random errors (10% chance)
const shouldSimulateError = () => Math.random() < 0.1;

// In-memory store to persist changes during session
let eventsStore = [...mockEvents];
let bookingsStore = [...mockBookings];
let usersStore = [...mockUsers];

// Auth service
export const authService = {
  async login(email, password) {
    await delay();
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (shouldSimulateError()) {
      throw new Error('Server error. Please try again.');
    }
    
    // Simulate successful login with any non-empty credentials
    const token = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
    localStorage.setItem('admin_token', token);
    
    return {
      token,
      user: {
        id: 1,
        name: 'Admin User',
        email,
        role: 'admin'
      }
    };
  },
  
  logout() {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  
  isAuthenticated() {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },
  
  getCurrentUser() {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;
    
    try {
      const decoded = JSON.parse(atob(token));
      return {
        id: 1,
        name: 'Admin User',
        email: decoded.email,
        role: 'admin'
      };
    } catch {
      return null;
    }
  }
};

// Events service
export const eventsService = {
  async fetchEvents({ page = 1, limit = 12, search = '', category = '', dateFilter = '' } = {}) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch events');
    }
    
    let filtered = [...eventsStore];
    
    // Apply filters
    if (search) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category && category !== 'All') {
      filtered = filtered.filter(event => event.category === category);
    }
    
    if (dateFilter) {
      const today = new Date();
      const eventDate = new Date(dateFilter);
      filtered = filtered.filter(event => {
        const eventDateObj = new Date(event.date);
        return eventDateObj.toDateString() === eventDate.toDateString();
      });
    }
    
    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const events = filtered.slice(startIndex, startIndex + limit);
    
    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  },
  
  async fetchEventById(id) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch event');
    }
    
    const event = eventsStore.find(e => e.id === parseInt(id));
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  },
  
  async createEvent(eventData) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to create event');
    }
    
    // Validate required fields
    if (!eventData.name || !eventData.venue || !eventData.date || !eventData.totalSeats) {
      throw new Error('Missing required fields');
    }
    
    // Validate date is in future
    if (new Date(eventData.date) <= new Date()) {
      throw new Error('Event date must be in the future');
    }
    
    // Validate seats is positive
    if (eventData.totalSeats <= 0) {
      throw new Error('Total seats must be a positive number');
    }
    
    const newEvent = {
      id: Math.max(...eventsStore.map(e => e.id)) + 1,
      ...eventData,
      availableSeats: eventData.totalSeats,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    
    eventsStore.push(newEvent);
    return newEvent;
  },
  
  async updateEvent(id, eventData) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to update event');
    }
    
    const index = eventsStore.findIndex(e => e.id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    // Validate required fields
    if (!eventData.name || !eventData.venue || !eventData.date || !eventData.totalSeats) {
      throw new Error('Missing required fields');
    }
    
    // Validate seats is positive
    if (eventData.totalSeats <= 0) {
      throw new Error('Total seats must be a positive number');
    }
    
    const updatedEvent = {
      ...eventsStore[index],
      ...eventData,
      id: parseInt(id)
    };
    
    eventsStore[index] = updatedEvent;
    return updatedEvent;
  },
  
  async deleteEvent(id) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to delete event');
    }
    
    const index = eventsStore.findIndex(e => e.id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    eventsStore.splice(index, 1);
    return { success: true };
  }
};

// Bookings service
export const bookingsService = {
  async fetchBookings({ page = 1, limit = 20, eventId = '', dateFilter = '' } = {}) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch bookings');
    }
    
    let filtered = [...bookingsStore];
    
    if (eventId) {
      filtered = filtered.filter(booking => booking.eventId === parseInt(eventId));
    }
    
    if (dateFilter) {
      const targetDate = new Date(dateFilter);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.toDateString() === targetDate.toDateString();
      });
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const bookings = filtered.slice(startIndex, startIndex + limit);
    
    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  },
  
  async fetchBookingById(id) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch booking');
    }
    
    const booking = bookingsStore.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  }
};

// Users service
export const usersService = {
  async fetchUsers({ page = 1, limit = 20, search = '' } = {}) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch users');
    }
    
    let filtered = [...usersStore];
    
    if (search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by registration date (newest first)
    filtered.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    
    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const users = filtered.slice(startIndex, startIndex + limit);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  },
  
  async fetchUserById(id) {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch user');
    }
    
    const user = usersStore.find(u => u.id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user's bookings
    const userBookings = bookingsStore.filter(b => b.userId === parseInt(id));
    
    return {
      ...user,
      bookings: userBookings
    };
  }
};

// Dashboard service
export const dashboardService = {
  async fetchDashboardData() {
    await delay();
    
    if (shouldSimulateError()) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    const today = new Date().toDateString();
    const bookingsToday = bookingsStore.filter(booking => 
      new Date(booking.createdAt).toDateString() === today
    ).length;
    
    const totalSeatsBooked = bookingsStore
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, booking) => sum + booking.seats, 0);
    
    return {
      totalEvents: eventsStore.length,
      bookingsToday,
      totalSeatsBooked,
      recentActivity: mockRecentActivity,
      upcomingEvents: eventsStore
        .filter(event => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
    };
  }
};

// Combined service for backward compatibility
export const mockService = {
  // Auth methods
  ...authService,
  
  // Events methods
  getEvents: eventsService.fetchEvents,
  createEvent: eventsService.createEvent,
  updateEvent: eventsService.updateEvent,
  deleteEvent: eventsService.deleteEvent,
  fetchEventById: eventsService.fetchEventById,
  
  // Bookings methods
  getBookings: async (page = 1, limit = 10, filters = {}) => {
    const response = await bookingsService.fetchBookings({ 
      page, 
      limit, 
      eventId: filters.eventId || '', 
      dateFilter: filters.date || '' 
    });
    
    // Calculate stats from bookings
    const allBookings = [...bookingsStore];
    const stats = {
      total: allBookings.length,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      pending: allBookings.filter(b => b.status === 'pending').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: allBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    };
    
    return {
      bookings: response.bookings,
      totalPages: response.pagination.totalPages,
      stats
    };
  },
  exportBookings: () => Promise.resolve({ success: true }),
  
  // Users methods
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    const response = await usersService.fetchUsers({ 
      page, 
      limit, 
      search: filters.search || ''
    });
    
    // Calculate stats from users
    const allUsers = [...usersStore];
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === 'active').length,
      inactive: allUsers.filter(u => u.status === 'inactive').length,
      admins: allUsers.filter(u => u.role === 'admin').length
    };
    
    return {
      users: response.users,
      totalPages: response.pagination.totalPages,
      stats
    };
  },
  deleteUser: () => Promise.resolve({ success: true }),
  toggleUserStatus: () => Promise.resolve({ success: true }),
  
  // Settings methods
  getSettings: () => Promise.resolve({
    notifications: { email: true, push: true, eventReminders: true, marketing: false },
    appearance: { theme: 'light', compactMode: false, animations: true },
    localization: { language: 'en', timezone: 'UTC', dateFormat: 'MM/DD/YYYY' },
    privacy: { profileVisibility: 'public', activityTracking: true, dataCollection: false }
  }),
  updateSettings: () => Promise.resolve({ success: true }),
  exportUserData: () => Promise.resolve({ success: true }),
  deleteAccount: () => Promise.resolve({ success: true }),
  
  // Profile methods
  getUserProfile: () => Promise.resolve({
    id: 1,
    name: 'Admin User',
    email: 'admin@trulicare.com',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    bio: 'System administrator for TruliCare event management platform.',
    lastPasswordChange: 'October 15, 2024'
  }),
  updateUserProfile: () => Promise.resolve({ success: true }),
  changePassword: () => Promise.resolve({ success: true }),
  
  // Dashboard methods
  getDashboardData: dashboardService.fetchDashboardData
};