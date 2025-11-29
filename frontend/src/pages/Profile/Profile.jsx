import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { mockService } from '../../mocks/mockService';
import { toast } from '../../utils/toast';
import { validators } from '../../utils/helpers';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Loader from '../../components/Common/Loader';
import styles from './Profile.module.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await mockService.getUserProfile();
      setProfile(response);
      setFormData({
        name: response.name,
        email: response.email,
        phone: response.phone || '',
        address: response.address || '',
        bio: response.bio || ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!validators.required(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validators.required(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !validators.phone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!validators.required(passwordData.currentPassword)) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!validators.required(passwordData.newPassword)) {
      newErrors.newPassword = 'New password is required';
    } else if (!validators.password(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with letters and numbers';
    }

    if (!validators.required(passwordData.confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;

    try {
      setUpdating(true);
      await mockService.updateUserProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      setChangingPassword(true);
      await mockService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || ''
    });
    setErrors({});
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className={styles.errorState}>
        <h2>Failed to load profile</h2>
        <Button onClick={loadProfile}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>Manage your account information and settings</p>
      </div>

      <div className={styles.profileGrid}>
        {/* Profile Information Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Profile Information</h2>
            {!editing ? (
              <Button
                variant="outline"
                icon={FiEdit3}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <div className={styles.editActions}>
                <Button
                  variant="primary"
                  icon={FiSave}
                  onClick={handleUpdateProfile}
                  loading={updating}
                  disabled={updating}
                  size="small"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  icon={FiX}
                  onClick={handleCancelEdit}
                  size="small"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.avatarInfo}>
              <h3>{profile.name}</h3>
              <p>{profile.role}</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              disabled={!editing}
              icon={FiUser}
              fullWidth
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={!editing}
              icon={FiMail}
              fullWidth
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              disabled={!editing}
              icon={FiPhone}
              fullWidth
              placeholder="+1 (555) 123-4567"
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              disabled={!editing}
              icon={FiMapPin}
              fullWidth
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className={styles.bioSection}>
            <label className={styles.bioLabel}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!editing}
              className={`${styles.bioTextarea} ${!editing ? styles.disabled : ''}`}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Account Security Card */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account Security</h2>
          </div>

          <div className={styles.securityInfo}>
            <div className={styles.securityItem}>
              <div className={styles.securityItemContent}>
                <h4>Password</h4>
                <p>Last changed: {profile.lastPasswordChange || 'Never'}</p>
              </div>
              <div className={styles.securityStatus}>
                <span className={styles.securityBadge}>Protected</span>
              </div>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.securityItemContent}>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
              </div>
              <div className={styles.securityStatus}>
                <span className={styles.securityBadgeDisabled}>Disabled</span>
              </div>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.securityItemContent}>
                <h4>Login Sessions</h4>
                <p>Manage your active sessions</p>
              </div>
              <div className={styles.securityStatus}>
                <Button variant="ghost" size="small">
                  Manage
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.passwordChangeSection}>
            <h3>Change Password</h3>
            
            <div className={styles.passwordForm}>
              <div className={styles.passwordField}>
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className={styles.passwordField}>
                <Input
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className={styles.passwordField}>
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleChangePassword}
                loading={changingPassword}
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                fullWidth
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;