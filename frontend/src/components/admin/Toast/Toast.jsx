import React, { useEffect, useState } from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import styles from './Toast.module.css';

const Toast = ({ id, message, type, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiAlertCircle />;
      case 'warning':
        return <FiAlertTriangle />;
      case 'info':
      default:
        return <FiInfo />;
    }
  };

  return (
    <div 
      className={`
        ${styles.toast} 
        ${styles[type]} 
        ${isVisible ? styles.visible : ''} 
        ${isExiting ? styles.exiting : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.icon}>
        {getIcon()}
      </div>
      
      <div className={styles.message}>
        {message}
      </div>
      
      <button 
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;