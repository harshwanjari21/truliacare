import React from 'react';
import styles from '../styles/BookingConfirmation.module.css';

const BookingConfirmation = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen || !bookingData) return null;

  const formatTickets = () => {
    const tickets = [];
    if (bookingData.ticketCounts.adult > 0) {
      tickets.push(`${bookingData.ticketCounts.adult} Adult${bookingData.ticketCounts.adult > 1 ? 's' : ''}`);
    }
    if (bookingData.ticketCounts.child > 0) {
      tickets.push(`${bookingData.ticketCounts.child} Child${bookingData.ticketCounts.child > 1 ? 'ren' : ''}`);
    }
    if (bookingData.ticketCounts.senior > 0) {
      tickets.push(`${bookingData.ticketCounts.senior} Senior${bookingData.ticketCounts.senior > 1 ? 's' : ''}`);
    }
    return tickets.join(', ');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Booking Confirmed!</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.bookingInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Booking ID:</span>
              <span className={styles.value}>{bookingData.bookingId}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Theater:</span>
              <span className={styles.value}>{bookingData.theater}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Date:</span>
              <span className={styles.value}>{bookingData.date}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Show Time:</span>
              <span className={styles.value}>{bookingData.showtime}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Seats:</span>
              <div className={styles.seatsList}>
                {bookingData.selectedSeats.map(seat => (
                  <span key={seat} className={styles.seatBadge}>{seat}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Tickets:</span>
              <span className={styles.value}>{formatTickets()}</span>
            </div>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.priceRow}>
              <span>Subtotal</span>
              <span>₹{bookingData.subtotal}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Convenience Fee</span>
              <span>₹{bookingData.convenienceFee}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Taxes & Fees</span>
              <span>₹{bookingData.taxes}</span>
            </div>
            <div className={`${styles.priceRow} ${styles.total}`}>
              <span>Total Amount</span>
              <span>₹{bookingData.totalAmount}</span>
            </div>
          </div>

          <div className={styles.successMessage}>
            <div className={styles.ticketIcon}>🎫</div>
            <h3>Your tickets have been booked successfully!</h3>
            <p>You will receive a confirmation SMS and email shortly.</p>
          </div>

          <div className={styles.actions}>
            <button className={styles.downloadButton}>
              📱 Download Tickets
            </button>
            <button className={styles.okButton} onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;