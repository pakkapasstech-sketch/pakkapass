import { useState,useEffect } from 'react';
import {
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
  HiOutlineX,
} from 'react-icons/hi';
import notificationService from '../../services/notificationsService';
import '../../styles/NotificationsPage.css';
import '../../styles/student-table.css';
import { useAuth } from '../../auth/AuthProvider';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { useNotifications } from '../../contexts/NotificationContext';
import { useStudentFilterOptions } from '../../hooks/useStudents';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePartners } from '../../hooks/usePartners';
import { useLoading } from '../../contexts/LoadingContext';

const NotificationsPage = () => {
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { notifications, setNotifications } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: optionsData } = useStudentFilterOptions();
  const options = optionsData || { grades: [], boards: [], branches: [] };
  const { data: partnersData } = usePartners({ limit: 1000 }, { enabled: isAdmin });
  const partners = partnersData?.partners || [];

  const [form, setForm] = useState({
    title: '',
    message: '',
    audience: 'All Students',
    priority: 'info',
    partnerId: '',
    gradeId: '',
    boardId: '',
    branchId: '',
  });

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  const filteredNotifications =
    notifications.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const handleCreate = async () => {
  if (!form.title || !form.message) return;

  try {
    const payload = {
      ...form,
      partnerId: form.partnerId ? parseInt(form.partnerId) : null,
      gradeId: form.gradeId ? parseInt(form.gradeId) : null,
      boardId: form.boardId ? parseInt(form.boardId) : null,
      branchId: form.branchId ? parseInt(form.branchId) : null,
    };
    

    await notificationService.createNotification(payload);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    setForm({
      title: '',
      message: '',
      audience: 'All Students',
      priority: 'info',
      partnerId: '',
      gradeId: '',
      boardId: '',
      branchId: '',
    });

    toast.success('Notification sent successfully');
    setShowModal(false);
  } catch (err) {
    console.error(err);
    toast.error('Failed to send notification');
  }
};

 const markAllRead = async () => {
  try {
    await notificationService.markAllRead();
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  } catch (err) {
    console.error('Failed to mark all notifications as read:', err);
  }
};

const handleSelectNotification = async (notification) => {
  setSelectedNotification(notification);
  if (!notification.read && !isAdmin) {
    try {
      await notificationService.markRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }
};


  const deleteNotification = async (id) => {
  try {
    await notificationService.deleteNotification(id);

    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (err) {
    console.error(err);
  }
};
  const { data: notificationsData, isSuccess, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notificationService.getNotifications();
      return data.map((item) => ({
        ...item,
        date: new Date(item.createdAt).toLocaleDateString(),
        read: item.read || item.isRead || false,
      }));
    }
  });

  useEffect(() => {
    if (isSuccess && notificationsData) {
      setNotifications(notificationsData);
    }
  }, [isSuccess, notificationsData, setNotifications]);

  useEffect(() => {
    setLoading(isLoading);
    return () => setLoading(false);
  }, [isLoading, setLoading]);
  const filteredBoards = form.gradeId
    ? (options.boards || []).filter((b) => !b.gradeId || Number(b.gradeId) === Number(form.gradeId))
    : (options.boards || []);

  const filteredBranches = (options.branches || []).filter((br) => {
    const matchGrade = !form.gradeId || !br.gradeId || Number(br.gradeId) === Number(form.gradeId);
    const matchBoard = !form.boardId || !br.boardId || Number(br.boardId) === Number(form.boardId);
    return matchGrade && matchBoard;
  });

  const notificationsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalNotifications = filteredNotifications.length;
  const totalPages = Math.ceil(totalNotifications / notificationsPerPage) || 1;
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="notifications-page">
      {/* Header */}

      <div className="notifications-header">
        <div>
          <h1>
            Notifications
          </h1>

          <p>
            Send and manage
            platform
            notifications.
          </p>
        </div>

        <div className="notification-actions">
          <button className="notification-btn" aria-label="Notifications">
            <HiOutlineBell />

            {unreadCount >
              0 && (
              <span className="notification-badge">
                {
                  unreadCount
                }
              </span>
            )}
          </button>

          {!isAdmin && (
  <button
    className="mark-read-btn"
    onClick={markAllRead}
  >
    <HiOutlineCheck />
    Mark All Read
  </button>
)}
         
{isAdmin && (
          <button
            className="create-btn"
            onClick={() =>
              setShowModal(
                true
              )
            }
          >
            <HiOutlinePlus />
            Add Notification
          </button>
)}
        </div>
      </div>

      {/* Search */}

      <div className="search-box">
        <HiOutlineSearch />

        <input
          placeholder="Search notifications..."
          value={search}
          onChange={(
            e
          ) =>
            setSearch(
              e.target
                .value
            )
          }
        />
      </div>

      {/* Notification List */}
      {isAdmin ? (
        <div className="student-table-card" style={{ marginTop: '24px' }}>
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Audience</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentNotifications.length > 0 ? (
                  currentNotifications.map((notification, index) => (
                    <tr
                      key={notification.id}
                      className="clickable-row"
                      onClick={() => handleSelectNotification(notification)}
                    >
                      <td style={{ color: 'var(--color-text-secondary)' }}>
                        {startIndex + index + 1}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--color-text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={notification.title}>
                        {notification.title}
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>
                        {notification.audience}
                        {notification.partner && ` (Partner: ${notification.partner.organizationName || notification.partner.contactFirstName || 'Selected Partner'})`}
                        {notification.grade && ` (Class: ${notification.grade.name})`}
                        {notification.board && ` (Board: ${notification.board.name})`}
                        {notification.branch && ` (Branch: ${notification.branch.name})`}
                      </td>
                      <td>
                        <span className={`priority ${notification.priority}`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-secondary)' }}>
                        {new Date(notification.createdAt || notification.date).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            className="view-btn"
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '6px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectNotification(notification);
                            }}
                            title="View Notification"
                          >
                            <HiOutlineEye size={18} />
                          </button>
                          <button
                            className="delete-btn"
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '6px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotificationToDelete(notification);
                            }}
                            title="Delete Notification"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalNotifications > 0 && (
            <div className="pagination" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p>
                Showing {startIndex + 1} to {Math.min(endIndex, totalNotifications)} of {totalNotifications}{' '}
                notifications
              </p>
              
              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  aria-label="Previous Page"
                >
                  <HiOutlineChevronLeft />
                </button>

                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active-page' : ''}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  aria-label="Next Page"
                >
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleSelectNotification(notification)}
            >
              <div className="notification-content">
                <div className="notification-top">
                  <div>
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                  </div>
                  <span className={`priority ${notification.priority}`}>
                    {notification.priority}
                  </span>
                </div>

                <div className="notification-footer">
                  <span>
                    To:{' '}
                    {notification.audience}
                    {notification.partner && ` (Partner: ${notification.partner.organizationName || notification.partner.contactFirstName || 'Selected Partner'})`}
                    {notification.grade && ` (Class: ${notification.grade.name})`}
                    {notification.board && ` (Board: ${notification.board.name})`}
                    {notification.branch && ` (Branch: ${notification.branch.name})`}
                  </span>

                  <span>
                    {new Date(notification.createdAt || notification.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Notification Modal */}

      {showModal && (
  <div className="modal-overlay">
    <div className="notification-modal">

      <div className="notification-modal-header">
        <h2>Add Notification</h2>

        
      </div>

      <div className="notification-modal-body">

        <div className="form-group">
          <label>Title</label>

          <input
            placeholder="Enter notification title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Message</label>

          <textarea
            rows="5"
            placeholder="Write your notification..."
            value={form.message}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
          />
        </div>

        <div className="notification-modal-grid">

          <div className="form-group">
            <label>Audience</label>

            <CommonFilterDropdown
  placeholder="Select Audience"
  value={form.audience}
  options={[
    'All Students',
    'Specific Students',
    'All Parents',
    'All Partners',
  ]}
  onChange={(value) =>
    setForm((prev) => ({
      ...prev,
      audience: value,
      partnerId: '', // Reset partner filter when audience changes
    }))
  }
/>
          </div>

          {form.audience === 'Specific Students' && (
            <>
              <div className="form-group">
                <label>Target Partner (Optional)</label>
                <CommonFilterDropdown
                  placeholder="All Partners (No Filter)"
                  value={
                    form.partnerId
                      ? partners.find((p) => p.id === Number(form.partnerId))?.organizationName || 
                        partners.find((p) => p.id === Number(form.partnerId))?.contactPerson || 
                        `Partner #${partners.find((p) => p.id === Number(form.partnerId))?.partnerId}`
                      : 'All Partners (No Filter)'
                  }
                  options={[
                    'All Partners (No Filter)',
                    ...partners.map((p) => p.organizationName || p.contactPerson || `Partner #${p.partnerId}`)
                  ]}
                  onChange={(value) => {
                    if (value === 'All Partners (No Filter)') {
                      setForm((prev) => ({ ...prev, partnerId: '' }));
                    } else {
                      const match = partners.find(p => (p.organizationName || p.contactPerson || `Partner #${p.partnerId}`) === value);
                      setForm((prev) => ({ ...prev, partnerId: match ? match.id : '' }));
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>Target Class (Optional)</label>
                <CommonFilterDropdown
                  placeholder="All Classes (No Filter)"
                  value={
                    form.gradeId
                      ? options.grades?.find((g) => g.id === Number(form.gradeId))?.name || 'All Classes (No Filter)'
                      : 'All Classes (No Filter)'
                  }
                  options={[
                    'All Classes (No Filter)',
                    ...(options.grades || []).map((g) => g.name)
                  ]}
                  onChange={(value) => {
                    if (value === 'All Classes (No Filter)') {
                      setForm((prev) => ({ ...prev, gradeId: '', boardId: '', branchId: '' }));
                    } else {
                      const match = (options.grades || []).find((g) => g.name === value);
                      const nextGradeId = match ? match.id : '';
                      setForm((prev) => {
                        const currentBoard = options.boards?.find((b) => b.id === Number(prev.boardId));
                        const isBoardCompatible = currentBoard && (!currentBoard.gradeId || Number(currentBoard.gradeId) === Number(nextGradeId));
                        const nextBoardId = isBoardCompatible ? prev.boardId : '';

                        const currentBranch = options.branches?.find((br) => br.id === Number(prev.branchId));
                        const isBranchCompatible = currentBranch && 
                          (!currentBranch.gradeId || Number(currentBranch.gradeId) === Number(nextGradeId)) &&
                          (!currentBranch.boardId || Number(currentBranch.boardId) === Number(nextBoardId));
                        const nextBranchId = isBranchCompatible ? prev.branchId : '';

                        return {
                          ...prev,
                          gradeId: nextGradeId,
                          boardId: nextBoardId,
                          branchId: nextBranchId,
                        };
                      });
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>Target Board (Optional)</label>
                <CommonFilterDropdown
                  placeholder="All Boards (No Filter)"
                  value={
                    form.boardId
                      ? options.boards?.find((b) => b.id === Number(form.boardId))?.name || 'All Boards (No Filter)'
                      : 'All Boards (No Filter)'
                  }
                  options={[
                    'All Boards (No Filter)',
                    ...filteredBoards.map((b) => b.name)
                  ]}
                  onChange={(value) => {
                    if (value === 'All Boards (No Filter)') {
                      setForm((prev) => ({ ...prev, boardId: '', branchId: '' }));
                    } else {
                      const match = filteredBoards.find((b) => b.name === value);
                      const nextBoardId = match ? match.id : '';
                      setForm((prev) => {
                        const currentBranch = options.branches?.find((br) => br.id === Number(prev.branchId));
                        const isBranchCompatible = currentBranch && 
                          (!currentBranch.boardId || Number(currentBranch.boardId) === Number(nextBoardId));
                        const nextBranchId = isBranchCompatible ? prev.branchId : '';

                        return {
                          ...prev,
                          boardId: nextBoardId,
                          branchId: nextBranchId,
                        };
                      });
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>Target Branch (Optional)</label>
                <CommonFilterDropdown
                  placeholder="All Branches (No Filter)"
                  value={
                    form.branchId
                      ? options.branches?.find((br) => br.id === Number(form.branchId))?.name || 'All Branches (No Filter)'
                      : 'All Branches (No Filter)'
                  }
                  options={[
                    'All Branches (No Filter)',
                    ...filteredBranches.map((br) => br.name)
                  ]}
                  onChange={(value) => {
                    if (value === 'All Branches (No Filter)') {
                      setForm((prev) => ({ ...prev, branchId: '' }));
                    } else {
                      const match = filteredBranches.find((br) => br.name === value);
                      setForm((prev) => ({ ...prev, branchId: match ? match.id : '' }));
                    }
                  }}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Priority</label>

            <CommonFilterDropdown
  placeholder="Priority"
  value={form.priority}
  options={[
    'info',
    'success',
    'warning',
    'urgent',
  ]}
  onChange={(value) =>
    setForm((prev) => ({
      ...prev,
      priority: value,
    }))
  }
/>
          </div>

        </div>

      </div>

      <div className="modal-actions">

        <button
          className="notification-cancel-btn"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="notification-send-btn"
          onClick={handleCreate}
        >
          Send Notification
        </button>

      </div>

    </div>
  </div>
)}{selectedNotification && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedNotification(null)}
  >
    <div
      className="notification-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="notification-modal-header">
        <h2>Notification Details</h2>
      </div>

      <div className="notification-modal-body">

        <div className="form-group">
          <label>Title</label>
          <input
            value={selectedNotification.title}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            rows="6"
            value={selectedNotification.message}
            disabled
          />
        </div>

        {isAdmin && (
          <>
            <div className="notification-modal-grid">

              <div className="form-group">
                <label>Audience</label>
                <input
                  value={selectedNotification.audience}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Target Partner</label>
                <input
                  value={
                    selectedNotification.partner?.organizationName ||
                    (selectedNotification.partner ? `${selectedNotification.partner.contactFirstName} ${selectedNotification.partner.contactLastName}` : '') ||
                    partners.find((p) => p.id === Number(selectedNotification.partnerId))?.organizationName ||
                    partners.find((p) => p.id === Number(selectedNotification.partnerId))?.contactPerson ||
                    'All Partners (No Filter)'
                  }
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Target Class</label>
                <input
                  value={
                    selectedNotification.grade?.name ||
                    options.grades?.find((g) => g.id === Number(selectedNotification.gradeId))?.name ||
                    'All Classes (No Filter)'
                  }
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Target Board</label>
                <input
                  value={
                    selectedNotification.board?.name ||
                    options.boards?.find((b) => b.id === Number(selectedNotification.boardId))?.name ||
                    'All Boards (No Filter)'
                  }
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Target Branch</label>
                <input
                  value={
                    selectedNotification.branch?.name ||
                    options.branches?.find((br) => br.id === Number(selectedNotification.branchId))?.name ||
                    'All Branches (No Filter)'
                  }
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <input
                  value={selectedNotification.priority}
                  disabled
                />
              </div>

            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                value={selectedNotification.date}
                disabled
              />
            </div>
          </>
        )}

      </div>

      <div className="modal-actions">
        <button
          className="notification-cancel-btn"
          onClick={() => setSelectedNotification(null)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

{notificationToDelete && (
  <div className="delete-confirmation-overlay">
    <div className="delete-confirmation-modal">
      <div className="delete-confirmation-header">
        <h3 className="delete-confirmation-title">Delete Notification</h3>
        <button
          className="delete-confirmation-close"
          onClick={() => setNotificationToDelete(null)}
          aria-label="Close modal"
        >
          <HiOutlineX />
        </button>
      </div>
      <div className="delete-confirmation-body">
        <p>Are you sure you want to delete this notification?</p>
        <p className="delete-confirmation-target">{notificationToDelete.title}</p>
      </div>
      <div className="delete-confirmation-actions">
        <button
          className="delete-confirmation-cancel"
          onClick={() => setNotificationToDelete(null)}
        >
          Cancel
        </button>
        <button
          className="delete-confirmation-submit"
          onClick={() => {
            deleteNotification(notificationToDelete.id);
            setNotificationToDelete(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default NotificationsPage;