import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/Events/EventForm';
import { eventsService } from '../../mocks/mockService';
import { toast } from '../../utils/toast';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (eventData) => {
    try {
      await eventsService.createEvent(eventData);
      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <div className={styles.createEventPage}>
      <div className={styles.pageHeader}>
        <h1>Create New Event</h1>
        <p>Fill in the details below to create a new event</p>
      </div>

      <EventForm 
        onSubmit={handleSubmit}
        submitLabel="Create Event"
      />
    </div>
  );
};

export default CreateEvent;