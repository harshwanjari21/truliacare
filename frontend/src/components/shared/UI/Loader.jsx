import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.dot1}></div>
        <div className={styles.dot2}></div>
        <div className={styles.dot3}></div>
      </div>
      {message && (
        <p className={styles.message}>{message}</p>
      )}
    </div>
  );
};

export default Loader;