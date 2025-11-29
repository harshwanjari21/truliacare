import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiEye, FiMapPin, FiClock, FiUsers, FiMoreVertical, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { formatDateTime, formatCurrency } from '../../../utils/shared/helpers';
import { eventsService } from '../../../mocks/admin/mockService';
import { toast } from '../../../utils/admin/toast';
import ConfirmDialog from '../../shared/UI/ConfirmDialog';
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
      case 'Active': return 'statusActive';
      case 'Closed': return 'statusCancelled';
      default: return 'statusDraft';
    }
  };

  const availabilityPercentage = (event.availableSeats / event.totalSeats) * 100;
  const isLowAvailability = availabilityPercentage < 20;
  const isMediumAvailability = availabilityPercentage < 50;

  // Format date and time separately
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  if (viewMode === 'list') {
    return (
      <>
        <div className={styles.listView}>
          <div className={styles.listImage}>
            <img 
              src={event.thumbnail || 'https://via.placeholder.com/120x90?text=Event'} 
              alt={event.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/120x90?text=Event';
              }}
            />
          </div>

          <div className={styles.listContent}>
            <div className={styles.listInfo}>
              <h3 className={styles.eventTitle}>{event.name}</h3>
              <div className={styles.listMeta}>
                <span className={styles.metaItem}>
                  <FiCalendar size={14} />
                  {formattedDate}
                </span>
                <span className={styles.metaItem}>
                  <FiClock size={14} />
                  {formattedTime}
                </span>
                <span className={styles.metaItem}>
                  <FiMapPin size={14} />
                  {event.venue}
                </span>
                <span className={styles.metaItem}>
                  <FiUsers size={14} />
                  {event.availableSeats}/{event.totalSeats} seats
                </span>
              </div>
            </div>

            <div className={styles.listActions}>
              <div className={styles.eventPrice}>
                {formatCurrency(event.price)}
              </div>
              
              <div className={styles.statusBadge}>
                <span className={`${styles.badge} ${styles[getStatusColor(event.status)]}`}>
                  {event.status}
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link 
                  to={`/events/edit/${event.id}`}
                  className={`${styles.actionButton} ${styles.editButton}`}
                  title="Edit event"
                >
                  <FiEdit3 size={16} />
                </Link>
                <Link 
                  to={`/bookings?eventId=${event.id}`}
                  className={`${styles.actionButton} ${styles.viewButton}`}
                  title="View bookings"
                >
                  <FiEye size={16} />
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Delete event"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
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
        <div className={styles.gridImage}>
          <img 
            src={event.thumbnail || 'https://via.placeholder.com/400x240?text=Event'} 
            alt={event.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x240?text=Event';
            }}
          />
          
          <div className={styles.imageOverlay}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={styles.menuButton}
            >
              <FiMoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className={styles.menuDropdown}>
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
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
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

        <div className={styles.gridContent}>
          <div className={styles.cardHeader}>
            <h3 className={styles.eventTitle}>{event.name}</h3>
            <div className={styles.priceTag}>
              <FiDollarSign size={16} />
              <span className={styles.eventPrice}>{formatCurrency(event.price)}</span>
            </div>
          </div>

          <div className={styles.eventMeta}>
            <div className={styles.metaItem}>
              <FiCalendar size={16} />
              <div className={styles.metaText}>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{formattedDate}</span>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <FiClock size={16} />
              <div className={styles.metaText}>
                <span className={styles.metaLabel}>Time</span>
                <span className={styles.metaValue}>{formattedTime}</span>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <FiMapPin size={16} />
              <div className={styles.metaText}>
                <span className={styles.metaLabel}>Venue</span>
                <span className={styles.metaValue}>{event.venue}</span>
              </div>
            </div>
            
            <div className={styles.metaItem}>
              <FiUsers size={16} />
              <div className={styles.metaText}>
                <span className={styles.metaLabel}>Seats</span>
                <span className={styles.metaValue}>{event.availableSeats} / {event.totalSeats}</span>
              </div>
            </div>
          </div>

          <div className={styles.seatsProgress}>
            <div className={styles.progressLabel}>
              <span>Seat Availability</span>
              <span className={`${
                isLowAvailability ? styles.lowAvailability : 
                isMediumAvailability ? styles.mediumAvailability : 
                styles.highAvailability
              }`}>
                {Math.round(availabilityPercentage)}% available
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${
                  isLowAvailability ? styles.progressFillLow : 
                  isMediumAvailability ? styles.progressFillMed : 
                  styles.progressFillHigh
                }`}
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