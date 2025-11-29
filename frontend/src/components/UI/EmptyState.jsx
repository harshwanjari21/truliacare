import React from 'react';
import { FiInbox, FiCalendar, FiUsers, FiBookOpen } from 'react-icons/fi';
import Button from './Button';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  icon: CustomIcon,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  actionText = 'Add New',
  onAction,
  type = 'default'
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'events':
        return FiCalendar;
      case 'users':
        return FiUsers;
      case 'bookings':
        return FiBookOpen;
      default:
        return FiInbox;
    }
  };

  const Icon = CustomIcon || getDefaultIcon();

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Icon />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        {action && onAction && (
          <div className={styles.action}>
            <Button onClick={onAction}>
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;