import React from 'react';
import { FiInbox } from 'react-icons/fi';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  icon: Icon = FiInbox, 
  title = 'No data found', 
  description = '', 
  action = null 
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrapper}>
        <Icon size={48} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;