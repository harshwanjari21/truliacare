import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEye, FiRefreshCw } from 'react-icons/fi';
import { mockService } from '../../mocks/mockService';
import { toast } from '../../utils/toast';
import { formatDate, formatCurrency } from '../../utils/helpers';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Loader from '../../components/Common/Loader';
import EmptyState from '../../components/Common/EmptyState';
import Pagination from '../../components/Common/Pagination';
import styles from './BookingsList.module.css';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  const statusOptions = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  useEffect(() => {
    loadBookings();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: statusFilter !== 'All' ? statusFilter.toLowerCase() : '',
        date: dateFilter
      };
      
      const response = await mockService.getBookings(currentPage, 10, filters);
      setBookings(response.bookings);
      setTotalPages(response.totalPages);
      setStats(response.stats);
    } catch (error) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const exportBookings = async () => {
    try {
      await mockService.exportBookings({ 
        search: searchTerm, 
        status: statusFilter !== 'All' ? statusFilter.toLowerCase() : '',
        date: dateFilter 
      });
      toast.success('Bookings exported successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to export bookings');
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = styles.statusBadge;
    const statusClass = {
      confirmed: styles.statusConfirmed,
      pending: styles.statusPending,
      cancelled: styles.statusCancelled
    }[status.toLowerCase()];
    return `${baseClass} ${statusClass}`;
  };

  if (loading && bookings.length === 0) {
    return <Loader text="Loading bookings..." />;
  }

  return (
    <div className={styles.bookingsContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bookings Management</h1>
          <p className={styles.subtitle}>
            Manage and track all event bookings
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            icon={FiDownload}
            onClick={exportBookings}
          >
            Export
          </Button>
          <Button
            variant="outline"
            icon={FiRefreshCw}
            onClick={() => loadBookings()}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Bookings</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.confirmed}</div>
          <div className={styles.statLabel}>Confirmed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersGrid}>
          <div className={styles.searchGroup}>
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={handleSearch}
              icon={FiSearch}
              fullWidth
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateFilter}
              className={styles.dateInput}
            />
          </div>
        </div>
        
        <div className={styles.statusFilters}>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`${
                styles.statusFilterButton
              } ${
                statusFilter === status ? styles.statusFilterActive : ''
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className={styles.tableCard}>
        {bookings.length === 0 ? (
          <EmptyState
            icon={FiFilter}
            message="No bookings found"
            description="Try adjusting your filters or search terms"
          />
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td className={styles.bookingId}>#{booking.id}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>{booking.customerName}</div>
                        <div className={styles.customerEmail}>{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.eventInfo}>
                        <div className={styles.eventName}>{booking.eventName}</div>
                        <div className={styles.eventVenue}>{booking.eventVenue}</div>
                      </div>
                    </td>
                    <td className={styles.eventDate}>
                      {formatDate(booking.eventDate, 'MMM dd, yyyy')}
                    </td>
                    <td className={styles.seats}>{booking.seats}</td>
                    <td className={styles.amount}>{formatCurrency(booking.totalAmount)}</td>
                    <td>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="ghost"
                          size="small"
                          icon={FiEye}
                          onClick={() => viewBookingDetails(booking)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <Modal
          title="Booking Details"
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          size="large"
        >
          <div className={styles.bookingDetails}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailsSection}>
                <h3>Booking Information</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Booking ID:</span>
                  <span>#{selectedBooking.id}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Status:</span>
                  <span className={getStatusBadgeClass(selectedBooking.status)}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Booking Date:</span>
                  <span>{formatDate(selectedBooking.bookingDate)}</span>
                </div>
              </div>
              
              <div className={styles.detailsSection}>
                <h3>Customer Information</h3>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Name:</span>
                  <span>{selectedBooking.customerName}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Email:</span>
                  <span>{selectedBooking.customerEmail}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Phone:</span>
                  <span>{selectedBooking.customerPhone}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.eventDetails}>
              <h3>Event Information</h3>
              <div className={styles.eventCard}>
                <div className={styles.eventCardContent}>
                  <h4>{selectedBooking.eventName}</h4>
                  <p>{selectedBooking.eventVenue}</p>
                  <p>{formatDate(selectedBooking.eventDate)}</p>
                </div>
                <div className={styles.bookingStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{selectedBooking.seats}</span>
                    <span className={styles.statLabel}>Seats</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{formatCurrency(selectedBooking.totalAmount)}</span>
                    <span className={styles.statLabel}>Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingsList;