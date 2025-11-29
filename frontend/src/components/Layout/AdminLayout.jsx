import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktopSize = window.innerWidth >= 1024;
      setIsDesktop(isDesktopSize);
      // On desktop, sidebar should always be considered "open" for styling
      // but we don't need to manage its state since it's always visible
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // On desktop, sidebar is always visible. On mobile, it's controlled by state
  const shouldShowSidebar = isDesktop || sidebarOpen;

  return (
    <div className={styles.adminLayout}>
      <Sidebar 
        isOpen={shouldShowSidebar} 
        onClose={closeSidebar}
        isDesktop={isDesktop}
      />
      
      <div className={styles.mainContent}>
        <Header onMenuClick={toggleSidebar} />
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
      
      {/* Mobile overlay - only show on mobile when sidebar is open */}
      {!isDesktop && sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;