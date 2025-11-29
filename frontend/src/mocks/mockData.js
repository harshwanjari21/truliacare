// Mock data for the ticket booking system
export const mockEvents = [
  {
    id: 1,
    name: "Summer Music Festival 2025",
    category: "Music",
    description: "A spectacular outdoor music festival featuring top artists from around the world.",
    venue: "Central Park Arena",
    date: "2025-07-15T18:00:00Z",
    totalSeats: 5000,
    availableSeats: 3250,
    price: 89.99,
    thumbnail: "https://picsum.photos/300/200?random=1",
    tags: ["Music", "Festival", "Outdoor"],
    bookingCutoff: "2025-07-14T23:59:59Z",
    status: "Active",
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Tech Conference 2025",
    category: "Technology",
    description: "Annual technology conference with industry leaders and innovative workshops.",
    venue: "Convention Center",
    date: "2025-03-20T09:00:00Z",
    totalSeats: 1200,
    availableSeats: 0,
    price: 299.99,
    thumbnail: "https://picsum.photos/300/200?random=2",
    tags: ["Technology", "Conference", "Networking"],
    bookingCutoff: "2025-03-19T23:59:59Z",
    status: "Closed",
    createdAt: "2025-01-10T14:30:00Z"
  },
  {
    id: 3,
    name: "Comedy Night Special",
    category: "Entertainment",
    description: "An evening of laughter with renowned stand-up comedians.",
    venue: "Laugh Club Downtown",
    date: "2025-02-28T20:00:00Z",
    totalSeats: 300,
    availableSeats: 150,
    price: 45.00,
    thumbnail: "https://picsum.photos/300/200?random=3",
    tags: ["Comedy", "Entertainment", "Night"],
    bookingCutoff: "2025-02-27T20:00:00Z",
    status: "Active",
    createdAt: "2025-01-20T09:15:00Z"
  },
  {
    id: 4,
    name: "Food & Wine Expo",
    category: "Food",
    description: "Taste the finest cuisines and wines from local and international vendors.",
    venue: "Exhibition Hall A",
    date: "2025-05-10T12:00:00Z",
    totalSeats: 800,
    availableSeats: 680,
    price: 75.50,
    thumbnail: "https://picsum.photos/300/200?random=4",
    tags: ["Food", "Wine", "Expo"],
    bookingCutoff: "2025-05-09T12:00:00Z",
    status: "Active",
    createdAt: "2025-01-25T11:20:00Z"
  },
  {
    id: 5,
    name: "Art Gallery Opening",
    category: "Art",
    description: "Exclusive opening of contemporary art exhibition featuring emerging artists.",
    venue: "Modern Art Museum",
    date: "2025-04-05T18:30:00Z",
    totalSeats: 200,
    availableSeats: 45,
    price: 25.00,
    thumbnail: "https://picsum.photos/300/200?random=5",
    tags: ["Art", "Exhibition", "Culture"],
    bookingCutoff: "2025-04-04T18:30:00Z",
    status: "Active",
    createdAt: "2025-01-30T16:45:00Z"
  }
];

export const mockBookings = [
  {
    id: "BK001",
    userId: 101,
    eventId: 1,
    seats: 2,
    status: "Confirmed",
    createdAt: "2025-01-20T14:30:00Z",
    user: {
      name: "John Smith",
      email: "john.smith@example.com"
    },
    event: {
      name: "Summer Music Festival 2025",
      date: "2025-07-15T18:00:00Z"
    }
  },
  {
    id: "BK002",
    userId: 102,
    eventId: 2,
    seats: 1,
    status: "Cancelled",
    createdAt: "2025-01-18T09:15:00Z",
    user: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com"
    },
    event: {
      name: "Tech Conference 2025",
      date: "2025-03-20T09:00:00Z"
    }
  },
  {
    id: "BK003",
    userId: 103,
    eventId: 3,
    seats: 4,
    status: "Confirmed",
    createdAt: "2025-01-25T11:20:00Z",
    user: {
      name: "Mike Wilson",
      email: "mike.w@example.com"
    },
    event: {
      name: "Comedy Night Special",
      date: "2025-02-28T20:00:00Z"
    }
  }
];

export const mockUsers = [
  {
    id: 101,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1-555-0101",
    registeredAt: "2024-12-01T10:00:00Z",
    totalBookings: 5,
    status: "Active"
  },
  {
    id: 102,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1-555-0102",
    registeredAt: "2024-11-15T14:30:00Z",
    totalBookings: 3,
    status: "Active"
  },
  {
    id: 103,
    name: "Mike Wilson",
    email: "mike.w@example.com",
    phone: "+1-555-0103",
    registeredAt: "2024-10-20T09:15:00Z",
    totalBookings: 8,
    status: "Active"
  }
];

export const mockCategories = [
  "All",
  "Music",
  "Technology",
  "Entertainment",
  "Food",
  "Art",
  "Sports",
  "Education",
  "Business"
];

export const mockRecentActivity = [
  {
    id: 1,
    type: "booking",
    message: "New booking for Summer Music Festival 2025",
    timestamp: "2025-01-29T14:30:00Z",
    user: "John Smith"
  },
  {
    id: 2,
    type: "event",
    message: "Tech Conference 2025 reached capacity",
    timestamp: "2025-01-29T12:15:00Z",
    user: "System"
  },
  {
    id: 3,
    type: "cancellation",
    message: "Booking cancelled for Comedy Night Special",
    timestamp: "2025-01-29T10:45:00Z",
    user: "Sarah Johnson"
  },
  {
    id: 4,
    type: "event",
    message: "New event created: Art Gallery Opening",
    timestamp: "2025-01-28T16:20:00Z",
    user: "Admin"
  }
];