import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit3, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';
import { usersService } from '../../../mocks/admin/apiService';
import { toast } from '../../../utils/admin/toast';
import { formatDate } from '../../../utils/shared/helpers';
import Input from '../../../components/shared/UI/Input';
import Button from '../../../components/shared/UI/Button';
import Modal from '../../../components/shared/UI/Modal';
import ConfirmDialog from '../../../components/shared/UI/ConfirmDialog';
import Loader from '../../../components/shared/UI/Loader';
import EmptyState from '../../../components/shared/Common/EmptyState';
import Pagination from '../../../components/shared/Common/Pagination';
import styles from './UsersList.module.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0
  });

  const roleOptions = ['All', 'Admin', 'User'];

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        role: roleFilter !== 'All' ? roleFilter.toLowerCase() : ''
      };
      
      const response = await usersService.getUsers(currentPage, 10, filters);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setStats(response.stats);
    } catch (error) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await mockService.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      setShowDeleteDialog(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await mockService.toggleUserStatus(userId);
      toast.success('User status updated successfully');
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const getRoleBadgeClass = (role) => {
    if (!role) return styles.roleBadge;
    const baseClass = styles.roleBadge;
    const roleClass = {
      admin: styles.roleAdmin,
      user: styles.roleUser
    }[role.toLowerCase()];
    return `${baseClass} ${roleClass || ''}`;
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return styles.statusBadge;
    const baseClass = styles.statusBadge;
    const statusClass = {
      active: styles.statusActive,
      inactive: styles.statusInactive
    }[status.toLowerCase()];
    return `${baseClass} ${statusClass || ''}`;
  };

  if (loading && users.length === 0) {
    return <Loader text="Loading users..." />;
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Users Management</h1>
          <p className={styles.subtitle}>
            Manage users and their permissions
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="primary"
            onClick={() => toast.info('Add user feature coming soon')}
          >
            <FiPlus />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.active}</div>
          <div className={styles.statLabel}>Active</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.inactive}</div>
          <div className={styles.statLabel}>Inactive</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.admins}</div>
          <div className={styles.statLabel}>Admins</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersGrid}>
          <div className={styles.searchGroup}>
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </div>
        </div>
        
        <div className={styles.roleFilters}>
          {roleOptions.map(role => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`${
                styles.roleFilterButton
              } ${
                roleFilter === role ? styles.roleFilterActive : ''
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableCard}>
        {users.length === 0 ? (
          <EmptyState
            message="No users found"
            description="Try adjusting your search terms or filters"
          >
            <FiSearch size={48} />
          </EmptyState>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td className={styles.lastLogin}>
                      {user.lastLogin ? formatDate(user.lastLogin, 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className={styles.joinDate}>
                      {formatDate(user.joinDate, 'MMM dd, yyyy')}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => viewUserDetails(user)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => toast.info('Edit user feature coming soon')}
                        >
                          <FiEdit3 />
                          Edit
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => confirmDeleteUser(user)}
                            className={styles.deleteButton}
                          >
                            <FiTrash2 />
                            Delete
                          </Button>
                        )}
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

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <Modal
          title="User Details"
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          size="large"
        >
          <div className={styles.userDetails}>
            <div className={styles.userHeader}>
              <div className={styles.userAvatarLarge}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <div className={styles.badges}>
                  <span className={getRoleBadgeClass(selectedUser.role)}>
                    {selectedUser.role}
                  </span>
                  <span className={getStatusBadgeClass(selectedUser.status)}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsGrid}>
              <div className={styles.detailsSection}>
                <h4>Contact Information</h4>
                <div className={styles.detailsRow}>
                  <FiMail className={styles.detailsIcon} />
                  <span>{selectedUser.email}</span>
                </div>
                <div className={styles.detailsRow}>
                  <FiPhone className={styles.detailsIcon} />
                  <span>{selectedUser.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div className={styles.detailsSection}>
                <h4>Account Information</h4>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>User ID:</span>
                  <span>#{selectedUser.id}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Join Date:</span>
                  <span>{formatDate(selectedUser.joinDate)}</span>
                </div>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Last Login:</span>
                  <span>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Button
                variant="primary"
                onClick={() => toggleUserStatus(selectedUser.id)}
              >
                {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'} User
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info('Edit user feature coming soon')}
              >
                <FiEdit3 />
                Edit User
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteDialog && userToDelete && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          type="danger"
        />
      )}
    </div>
  );
};

export default UsersList;