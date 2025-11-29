import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { eventsService } from '../../../mocks/admin/mockService';
import { mockCategories } from '../../../mocks/shared/mockData';
import { debounce } from '../../../utils/shared/helpers';
import { toast } from '../../../utils/admin/toast';
import EventCard from '../../../components/admin/Events/EventCard';
import Pagination from '../../../components/shared/Common/Pagination';
import Loader from '../../../components/shared/UI/Loader';
import EmptyState from '../../../components/shared/Common/EmptyState';
import styles from './EventsList.module.css';

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Debounced search
  const debouncedSearch = debounce((searchTerm) => {
    fetchEvents({ search: searchTerm, page: 1 });
  }, 300);

  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      const response = await eventsService.fetchEvents({
        search,
        category: category === 'All' ? '' : category,
        dateFilter,
        page: 1,
        limit: 12,
        ...params
      });
      
      setEvents(response.events);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    } else {
      fetchEvents({ search: '', page: 1 });
    }
  }, [search]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    fetchEvents({ category: newCategory === 'All' ? '' : newCategory, page: 1 });
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
    fetchEvents({ dateFilter: date, page: 1 });
  };

  const handlePageChange = (page) => {
    fetchEvents({ page });
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(events.filter(event => event.id !== deletedEventId));
    toast.success('Event deleted successfully');
  };

  return (
    <div className={styles.eventsListPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1>Events Management</h1>
            <p>Manage your events and track their performance</p>
          </div>
          
          <Link to="/events/create" className={styles.createButton}>
            <FiPlus size={18} />
            Create Event
          </Link>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.filterSelect}
            >
              {mockCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className={styles.dateFilter}
            />
          </div>
        </div>
        
        <div className={styles.viewControls}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <FiGrid size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <EmptyState 
            title="No events found"
            description={search || category !== 'All' || dateFilter 
              ? "Try adjusting your filters to find events" 
              : "Get started by creating your first event"
            }
            action={
              <Link to="/events/create" className={styles.emptyStateButton}>
                <FiPlus size={18} />
                Create Event
              </Link>
            }
          />
        ) : (
          <>
            <div className={`${styles.eventsGrid} ${styles[viewMode]}`}>
              {events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDeleted={handleEventDeleted}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {pagination.totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsList;