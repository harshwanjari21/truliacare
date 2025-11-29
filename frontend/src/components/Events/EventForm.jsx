import React, { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { validators, validateImageFile, getImagePreviewUrl } from '../../utils/helpers';
import { mockCategories } from '../../mocks/mockData';
import { toast } from '../../utils/toast';
import Input from '../UI/Input';
import Button from '../UI/Button';
import styles from './EventForm.module.css';

const EventForm = ({ 
  initialData = null, 
  onSubmit, 
  onDelete = null, 
  submitLabel = 'Save Event' 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Music',
    description: initialData?.description || '',
    venue: initialData?.venue || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    totalSeats: initialData?.totalSeats || '',
    price: initialData?.price || '',
    tags: initialData?.tags?.join(', ') || '',
    bookingCutoff: initialData?.bookingCutoff ? new Date(initialData.bookingCutoff).toISOString().slice(0, 16) : '',
    thumbnail: initialData?.thumbnail || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.thumbnail || null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageFile(file);
    const previewUrl = getImagePreviewUrl(file);
    setImagePreview(previewUrl);
    
    // Clear any existing thumbnail URL since we're uploading a new image
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validators.required(formData.name)) {
      newErrors.name = 'Event name is required';
    }

    if (!validators.required(formData.venue)) {
      newErrors.venue = 'Venue is required';
    }

    if (!validators.required(formData.date)) {
      newErrors.date = 'Event date is required';
    } else if (!validators.futureDate(formData.date)) {
      newErrors.date = 'Event date must be in the future';
    }

    if (!validators.required(formData.totalSeats)) {
      newErrors.totalSeats = 'Total seats is required';
    } else if (!validators.positiveNumber(formData.totalSeats)) {
      newErrors.totalSeats = 'Total seats must be a positive number';
    }

    if (!validators.required(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (!validators.positiveNumber(formData.price)) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.bookingCutoff && new Date(formData.bookingCutoff) >= new Date(formData.date)) {
      newErrors.bookingCutoff = 'Booking cutoff must be before the event date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const eventData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        thumbnail: imagePreview || formData.thumbnail
      };

      await onSubmit(eventData);
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.eventFormContainer}>
      <form onSubmit={handleSubmit} className={styles.eventForm}>
        <div className={styles.formGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              
              <div className={styles.formGroup}>
                <Input
                  label="Event Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  fullWidth
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    {mockCategories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    required
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows="4"
                  placeholder="Describe your event..."
                />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Event Details</h3>
              
              <div className={styles.formGroup}>
                <Input
                  label="Venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  error={errors.venue}
                  required
                  fullWidth
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <Input
                    label="Event Date & Time"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    required
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Booking Cutoff (Optional)"
                    name="bookingCutoff"
                    type="datetime-local"
                    value={formData.bookingCutoff}
                    onChange={handleChange}
                    error={errors.bookingCutoff}
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <Input
                    label="Total Seats"
                    name="totalSeats"
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    error={errors.totalSeats}
                    required
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Tags (comma separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="music, festival, outdoor"
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Event Image</h3>
              
              <div className={styles.imageUpload}>
                {imagePreview ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Event preview" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className={styles.removeImageButton}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className={styles.hiddenInput}
                    />
                    <FiUpload size={24} />
                    <span>Upload Event Image</span>
                    <small>JPEG, PNG, WebP up to 5MB</small>
                  </label>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                disabled={loading}
              >
                {submitLabel}
              </Button>

              {onDelete && (
                <Button
                  type="button"
                  variant="danger"
                  size="large"
                  onClick={onDelete}
                >
                  Delete Event
                </Button>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.previewSection}>
              <h3 className={styles.sectionTitle}>Preview</h3>
              <div className={styles.eventPreview}>
                <div className={styles.previewImage}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <FiImage size={48} />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>
                <div className={styles.previewContent}>
                  <h4>{formData.name || 'Event Name'}</h4>
                  <p className={styles.previewVenue}>{formData.venue || 'Venue'}</p>
                  <p className={styles.previewPrice}>
                    {formData.price ? `$${formData.price}` : '$0.00'}
                  </p>
                  {formData.description && (
                    <p className={styles.previewDescription}>
                      {formData.description.substring(0, 100)}
                      {formData.description.length > 100 && '...'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;