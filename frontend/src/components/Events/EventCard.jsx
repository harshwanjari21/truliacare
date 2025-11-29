import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiEye, FiMapPin, FiClock, FiUsers, FiMoreVertical } from 'react-icons/fi';
import { formatDateTime, formatCurrency } from '../../utils/helpers';
import { eventsService } from '../../mocks/mockService';
import { toast } from '../../utils/toast';
import ConfirmDialog from '../UI/ConfirmDialog';
import styles from './EventCard.module.css';

const EventCard = ({ event, onDeleted, viewMode = 'grid' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eventsService.deleteEvent(event.id);
      onDeleted(event.id);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Closed': return 'danger';
      default: return 'warning';
    }
  };

  const availabilityPercentage = (event.availableSeats / event.totalSeats) * 100;

  if (viewMode === 'list') {
    return (
      <>
        <div className={styles.eventListItem}>
          <div className={styles.eventImage}>
            <img 
              src={event.thumbnail || 'https://via.placeholder.com/80x60?text=Event'} 
              alt={event.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x60?text=Event';
              }}
            />
          </div>

          <div className={styles.eventInfo}>
            <h3 className={styles.eventTitle}>{event.name}</h3>
            <div className={styles.eventMeta}>
              <span className={styles.metaItem}>
                <FiClock size={14} />
                {formatDateTime(event.date)}
              </span>
              <span className={styles.metaItem}>
                <FiMapPin size={14} />
                {event.venue}
              </span>
              <span className={styles.metaItem}>
                <FiUsers size={14} />
                {event.availableSeats}/{event.totalSeats} available
              </span>
            </div>
          </div>

          <div className={styles.eventPrice}>
            {formatCurrency(event.price)}
          </div>

          <div className={styles.eventStatus}>
            <span className={`${styles.statusBadge} ${styles[getStatusColor(event.status)]}`}>
              {event.status}
            </span>
          </div>

          <div className={styles.eventActions}>
            <Link 
              to={`/events/edit/${event.id}`}
              className={styles.actionButton}
              title="Edit event"
            >
              <FiEdit3 size={16} />
            </Link>
            <Link 
              to={`/bookings?eventId=${event.id}`}
              className={styles.actionButton}
              title="View bookings"
            >
              <FiEye size={16} />
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className={`${styles.actionButton} ${styles.danger}`}
              title="Delete event"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Event"
          message={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
          confirmText="Delete"
          loading={deleting}
        />
      </>
    );
  }

  return (
    <>
      <div className={styles.eventCard}>
        <div className={styles.cardImage}>
          <img 
            src={event.thumbnail || 'https://via.placeholder.com/300x200?text=Event'} 
            alt={event.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Event';
            }}
          />
          
          <div className={styles.cardOverlay}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={styles.menuButton}
            >
              <FiMoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className={styles.contextMenu}>
                <Link 
                  to={`/events/edit/${event.id}`}
                  className={styles.menuItem}
                  onClick={() => setShowMenu(false)}
                >
                  <FiEdit3 size={14} />
                  Edit
                </Link>
                <Link 
                  to={`/bookings?eventId=${event.id}`}
                  className={styles.menuItem}
                  onClick={() => setShowMenu(false)}
                >
                  <FiEye size={14} />
                  View Bookings
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteDialog(true);
                  }}
                  className={`${styles.menuItem} ${styles.danger}`}
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className={styles.statusBadge}>
            <span className={`${styles.badge} ${styles[getStatusColor(event.status)]}`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{event.name}</h3>
            <span className={styles.cardPrice}>{formatCurrency(event.price)}</span>
          </div>

          <div className={styles.cardMeta}>
            <div className={styles.metaRow}>
              <FiClock size={14} />
              <span>{formatDateTime(event.date)}</span>
            </div>
            <div className={styles.metaRow}>
              <FiMapPin size={14} />
              <span>{event.venue}</span>
            </div>
            <div className={styles.metaRow}>
              <FiUsers size={14} />
              <span>{event.availableSeats} / {event.totalSeats} seats</span>
            </div>
          </div>

          <div className={styles.availabilityBar}>
            <div className={styles.availabilityLabel}>
              <span>Availability</span>
              <span>{Math.round(availabilityPercentage)}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${availabilityPercentage}%` }}
              />
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className={styles.cardTags}>
              {event.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className={styles.moreTag}>+{event.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </>
  );
};

export default EventCard;