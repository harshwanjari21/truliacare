import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { toast as toastManager } from '../../../utils/admin/toast';
import styles from './ToastContainer.module.css';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.addListener(setToasts);
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => toastManager.remove(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;