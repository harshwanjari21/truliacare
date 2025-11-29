import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiCreditCard, 
  FiUsers, 
  FiTrendingUp,
  FiClock,
  FiMapPin,
  FiEye
} from 'react-icons/fi';
import { dashboardService } from '../../mocks/mockService';
import { formatDateTime, formatCurrency } from '../../utils/helpers';
import { toast } from '../../utils/toast';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className={styles.error}>
        <p>Failed to load dashboard data</p>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Events',
      value: dashboardData.totalEvents,
      icon: FiCalendar,
      color: 'primary',
      link: '/events'
    },
    {
      title: 'Bookings Today',
      value: dashboardData.bookingsToday,
      icon: FiCreditCard,
      color: 'success',
      link: '/bookings'
    },
    {
      title: 'Seats Sold',
      value: dashboardData.totalSeatsBooked,
      icon: FiUsers,
      color: 'accent',
      link: '/bookings'
    },
    {
      title: 'Revenue',
      value: '$0', // Placeholder for revenue calculation
      icon: FiTrendingUp,
      color: 'warning',
      link: '/analytics'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return FiCreditCard;
      case 'event':
        return FiCalendar;
      case 'cancellation':
        return FiUsers;
      default:
        return FiClock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking':
        return 'success';
      case 'event':
        return 'primary';
      case 'cancellation':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Welcome header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/events/create">
            <Button variant="primary">
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={index} 
              to={stat.link} 
              className={`${styles.statCard} ${styles[stat.color]}`}
            >
              <div className={styles.statIcon}>
                <Icon />
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statTitle}>{stat.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.contentGrid}>
        {/* Recent Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <Link to="/events" className={styles.cardAction}>
              View All
            </Link>
          </div>
          <div className={styles.activityList}>
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map(activity => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[getActivityColor(activity.type)]}`}>
                      <Icon />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityMessage}>{activity.message}</p>
                      <p className={styles.activityTime}>
                        {formatDateTime(activity.timestamp)} • by {activity.user}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyText}>No recent activity</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Events</h2>
            <Link to="/events" className={styles.cardAction}>
              View All
            </Link>
          </div>
          <div className={styles.eventsList}>
            {dashboardData.upcomingEvents.length > 0 ? (
              dashboardData.upcomingEvents.map(event => (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventImage}>
                    <img 
                      src={event.thumbnail} 
                      alt={event.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=Event';
                      }}
                    />
                  </div>
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventName}>{event.name}</h3>
                    <div className={styles.eventDetails}>
                      <span className={styles.eventDetail}>
                        <FiClock />
                        {formatDateTime(event.date)}
                      </span>
                      <span className={styles.eventDetail}>
                        <FiMapPin />
                        {event.venue}
                      </span>
                      <span className={styles.eventDetail}>
                        <FiUsers />
                        {event.availableSeats}/{event.totalSeats} seats
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/events/edit/${event.id}`}
                    className={styles.eventAction}
                  >
                    <FiEye />
                  </Link>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className={styles.chartSection}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Analytics Overview</h2>
            <Link to="/analytics" className={styles.cardAction}>
              View Details
            </Link>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartIcon}>
              <FiTrendingUp />
            </div>
            <h3>Analytics Coming Soon</h3>
            <p>Detailed analytics and reporting features will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;