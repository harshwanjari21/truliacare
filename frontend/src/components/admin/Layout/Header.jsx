import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiSearch, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { authService } from '../../../mocks/admin/mockService';
import { toast } from '../../../utils/admin/toast';
import styles from './Header.module.css';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  const currentUser = authService.getCurrentUser();

  // Get page title based on current route
  const getPageTitle = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/events': 'Events',
      '/events/create': 'Create Event',
      '/bookings': 'Bookings',
      '/users': 'Users',
      '/analytics': 'Analytics',
      '/settings': 'Settings',
      '/profile': 'Profile'
    };
    
    if (location.pathname.startsWith('/events/edit/')) {
      return 'Edit Event';
    }
    
    return pathMap[location.pathname] || 'Admin Panel';
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
      toast.info(`Search functionality coming soon: "${searchQuery}"`);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={styles.header}>
      {/* Mobile menu button */}
      <button 
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <FiMenu />
      </button>

      {/* Page title */}
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>

      {/* Search */}
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </form>

      {/* User menu */}
      <div className={styles.userMenu} ref={userMenuRef}>
        <button 
          className={styles.userButton}
          onClick={toggleUserMenu}
          aria-expanded={showUserMenu}
        >
          <div className={styles.userAvatar}>
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <span className={styles.userName}>{currentUser?.name || 'Admin'}</span>
        </button>

        {showUserMenu && (
          <div className={styles.userDropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                navigate('/profile');
                setShowUserMenu(false);
              }}
            >
              <FiUser />
              Profile
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                navigate('/settings');
                setShowUserMenu(false);
              }}
            >
              <FiSettings />
              Settings
            </button>
            <hr className={styles.dropdownDivider} />
            <button
              className={styles.dropdownItem}
              onClick={handleLogout}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;