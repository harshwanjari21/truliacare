import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../../../components/admin/Events/EventForm';
import { eventsService } from '../../../mocks/admin/mockService';
import { toast } from '../../../utils/admin/toast';
import Loader from '../../../components/shared/UI/Loader';
import styles from './EditEvent.module.css';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const eventData = await eventsService.fetchEventById(id);
      setEvent(eventData);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (eventData) => {
    try {
      await eventsService.updateEvent(id, eventData);
      toast.success('Event updated successfully!');
      navigate('/events');
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await eventsService.deleteEvent(id);
        toast.success('Event deleted successfully!');
        navigate('/events');
      } catch (error) {
        toast.error(error.message || 'Failed to delete event');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!event) {
    return (
      <div className={styles.errorState}>
        <h2>Event not found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/events')}>
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editEventPage}>
      <div className={styles.pageHeader}>
        <h1>Edit Event</h1>
        <p>Update the event details below</p>
      </div>

      <EventForm 
        initialData={event}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitLabel="Update Event"
      />
    </div>
  );
};

export default EditEvent;