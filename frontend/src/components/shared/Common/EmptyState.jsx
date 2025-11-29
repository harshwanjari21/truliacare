import React from 'react';
import { FiInbox } from 'react-icons/fi';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  icon: Icon,
  children,
  message,
  title = message || 'No data found', 
  description = '', 
  action = null 
}) => {
  // Determine what icon to show - children take precedence, then icon prop, then default
  const iconElement = children || (Icon && <Icon size={48} className={styles.icon} />) || <FiInbox size={48} className={styles.icon} />;
  
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrapper}>
        {iconElement}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;