import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiPlus, 
  FiBookOpen, 
  FiUsers, 
  // FiBarChart, // Removed - not needed
  // FiSettings, // Removed - not needed
  // FiUser, // Commented out - reserved for future use
  FiLogOut,
  FiX
} from 'react-icons/fi';
import { authService } from '../../../mocks/admin/apiService';
import { toast } from '../../../utils/admin/toast';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/events', label: 'Events', icon: FiCalendar },
  { path: '/events/create', label: 'Create Event', icon: FiPlus },
  { path: '/bookings', label: 'Bookings', icon: FiBookOpen },
  { path: '/users', label: 'Users', icon: FiUsers },
  // Profile menu item commented out - not needed for current version, reserved for future use
  // { path: '/profile', label: 'Profile', icon: FiUser }
  // Settings menu item removed - not needed
];

const Sidebar = ({ isOpen, onClose, isDesktop = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMenuClick = () => {
    // Close sidebar on mobile when menu item is clicked
    if (!isDesktop && window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Mobile close button - only show on mobile */}
      {!isDesktop && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FiX />
        </button>
      )}

      {/* Logo/Brand */}
      <div className={styles.brand}>
        <h1>TicketAdmin</h1>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className={styles.menuItem}>
                {item.disabled ? (
                  <div className={`${styles.menuLink} ${styles.disabled}`}>
                    <Icon className={styles.menuIcon} />
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.comingSoon}>Soon</span>
                  </div>
                ) : (
                  <Link 
                    to={item.path}
                    className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                    onClick={handleMenuClick}
                  >
                    <Icon className={styles.menuIcon} />
                    <span className={styles.menuLabel}>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User actions */}
      <div className={styles.userActions}>
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <FiLogOut className={styles.menuIcon} />
          <span className={styles.menuLabel}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;