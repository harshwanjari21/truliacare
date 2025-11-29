import React, { useState, useEffect } from 'react';
import { FiBell, FiMoon, FiGlobe, FiShield, FiDatabase, FiDownload, FiTrash2, FiCheck } from 'react-icons/fi';
import { mockService } from '../../mocks/mockService';
import { toast } from '../../utils/toast';
import Button from '../../components/UI/Button';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import Loader from '../../components/Common/Loader';
import styles from './Settings.module.css';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await mockService.getSettings();
      setSettings(response);
    } catch (error) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (category, key, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value
        }
      };
      
      setSettings(updatedSettings);
      
      // Auto-save with debouncing
      setSaving(true);
      await mockService.updateSettings({ [category]: { [key]: value } });
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update setting');
      // Revert on error
      loadSettings();
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      await mockService.exportUserData();
      toast.success('Data export started. You will receive an email when ready.');
      setShowExportDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await mockService.deleteAccount();
      toast.success('Account deletion process started');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return <Loader text="Loading settings..." />;
  }

  if (!settings) {
    return (
      <div className={styles.errorState}>
        <h2>Failed to load settings</h2>
        <Button onClick={loadSettings}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Customize your experience and manage your preferences
        </p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Notifications Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiBell className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Notifications</h2>
                <p className={styles.cardDescription}>
                  Manage how you receive notifications
                </p>
              </div>
            </div>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Push Notifications</h4>
                <p>Receive push notifications in your browser</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Event Reminders</h4>
                <p>Get reminded about upcoming events</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.notifications.eventReminders}
                  onChange={(e) => handleSettingChange('notifications', 'eventReminders', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Marketing Emails</h4>
                <p>Receive promotional emails and updates</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.notifications.marketing}
                  onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiMoon className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Appearance</h2>
                <p className={styles.cardDescription}>
                  Customize the look and feel
                </p>
              </div>
            </div>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Theme</h4>
                <p>Choose your preferred color scheme</p>
              </div>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className={styles.select}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Compact Mode</h4>
                <p>Use a more compact layout</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.appearance.compactMode}
                  onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Animation Effects</h4>
                <p>Enable smooth animations and transitions</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.appearance.animations}
                  onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiGlobe className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Localization</h2>
                <p className={styles.cardDescription}>
                  Set your language and regional preferences
                </p>
              </div>
            </div>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Language</h4>
                <p>Choose your preferred language</p>
              </div>
              <select
                value={settings.localization.language}
                onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Timezone</h4>
                <p>Set your local timezone</p>
              </div>
              <select
                value={settings.localization.timezone}
                onChange={(e) => handleSettingChange('localization', 'timezone', e.target.value)}
                className={styles.select}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London Time</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Date Format</h4>
                <p>Choose how dates are displayed</p>
              </div>
              <select
                value={settings.localization.dateFormat}
                onChange={(e) => handleSettingChange('localization', 'dateFormat', e.target.value)}
                className={styles.select}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiShield className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Privacy & Security</h2>
                <p className={styles.cardDescription}>
                  Manage your privacy and security settings
                </p>
              </div>
            </div>
          </div>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Profile Visibility</h4>
                <p>Control who can see your profile</p>
              </div>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className={styles.select}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Activity Tracking</h4>
                <p>Allow tracking for analytics</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.privacy.activityTracking}
                  onChange={(e) => handleSettingChange('privacy', 'activityTracking', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingContent}>
                <h4>Data Collection</h4>
                <p>Allow data collection for service improvement</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.privacy.dataCollection}
                  onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiDatabase className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Data Management</h2>
                <p className={styles.cardDescription}>
                  Export or delete your data
                </p>
              </div>
            </div>
          </div>

          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <div className={styles.actionContent}>
                <h4>Export Data</h4>
                <p>Download a copy of all your data</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(true)}
              >
                <FiDownload />
                Export
              </Button>
            </div>

            <div className={styles.actionItem}>
              <div className={styles.actionContent}>
                <h4>Clear Cache</h4>
                <p>Clear browser cache and temporary data</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  toast.success('Cache cleared successfully');
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${styles.settingsCard} ${styles.dangerZone}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <FiTrash2 className={styles.cardIcon} />
              <div>
                <h2 className={styles.cardTitle}>Danger Zone</h2>
                <p className={styles.cardDescription}>
                  Irreversible actions - proceed with caution
                </p>
              </div>
            </div>
          </div>

          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <div className={styles.actionContent}>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteDialog(true)}
              >
                <FiTrash2 />
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Data Confirmation */}
      {showExportDialog && (
        <ConfirmDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onConfirm={handleExportData}
          title="Export Data"
          message="This will create a downloadable archive of all your data. You'll receive an email when the export is ready."
          confirmLabel="Export"
          type="info"
        />
      )}

      {/* Delete Account Confirmation */}
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="This action cannot be undone. All your data, events, and bookings will be permanently deleted."
          confirmLabel="Delete Account"
          type="danger"
        />
      )}

      {/* Auto-save indicator */}
      {saving && (
        <div className={styles.saveIndicator}>
          <FiCheck className={styles.saveIcon} />
          <span>Saved</span>
        </div>
      )}
    </div>
  );
};

export default Settings;