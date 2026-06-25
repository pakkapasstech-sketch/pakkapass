import { useState } from 'react';
import {
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineCheck,
} from 'react-icons/hi';

import '../../styles/NotificationsPage.css'
import { useAuth } from '../../auth/AuthProvider';
import CommonFilterDropdown from '../../components/common/CommonFilterDropdown';
const initialNotifications = [
 {
  id: 1,
  title: 'Question Paper Uploaded',
  message:
    'The Mathematics Mid-Term Question Paper has been uploaded successfully.',
  audience: 'Class 10 Students',
  priority: 'info',
  date: '16 Jul 2025',
  read: false,
},
  {
    id: 2,
    title: 'New Physics Videos',
    message:
      'New Physics videos have been uploaded for Class 10.',
    audience: 'Class 10',
    priority: 'info',
    date: '15 Jul 2025',
    read: true,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState(
      initialNotifications
    );

  const [search, setSearch] =
    useState('');

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] =
    useState({
      title: '',
      message: '',
      audience:
        'All Students',
      priority: 'info',
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

  const handleCreate =
    () => {
      if (
        !form.title ||
        !form.message
      ) {
        return;
      }

      const newNotification =
        {
          id: Date.now(),

          title:
            form.title,

          message:
            form.message,

          audience:
            form.audience,

          priority:
            form.priority,

          date:
            new Date().toLocaleDateString(),

          read: false,
        };

      setNotifications(
        (prev) => [
          newNotification,
          ...prev,
        ]
      );

      setForm({
        title: '',
        message: '',
        audience:
          'All Students',
        priority: 'info',
      });

      setShowModal(
        false
      );
    };

  const markAllRead =
    () => {
      setNotifications(
        (prev) =>
          prev.map(
            (item) => ({
              ...item,
              read: true,
            })
          )
      );
    };
  const { user } = useAuth();

const isAdmin = user?.role === 'ADMIN';
  const deleteNotification =
    (id) => {
      setNotifications(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !==
              id
          )
      );
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
          <button className="notification-btn">
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

          <button
            className="mark-read-btn"
            onClick={
              markAllRead
            }
          >
            <HiOutlineCheck />
            Mark All Read
          </button>
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

      <div className="notifications-list">
        {filteredNotifications.map(
          (
            notification
          ) => (
            <div
              key={
                notification.id
              }
              className={`notification-card ${
                !notification.read
                  ? 'unread'
                  : ''
              }`}
            >
              <div className="notification-content">
                <div className="notification-top">
                  <div>
                    <h3>
                      {
                        notification.title
                      }
                    </h3>

                    <p>
                      {
                        notification.message
                      }
                    </p>
                  </div>

                  <span
                    className={`priority ${notification.priority}`}
                  >
                    {
                      notification.priority
                    }
                  </span>
                </div>

                <div className="notification-footer">
                  <span>
                    To:
                    {' '}
                    {
                      notification.audience
                    }
                  </span>

                  <span>
                    {
                      notification.date
                    }
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteNotification(
                        notification.id
                      )
                    }
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

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
    'Class 10',
    'Class 11',
    'Class 12',
    'JEE Students',
    'NEET Students',
  ]}
  onChange={(value) =>
    setForm((prev) => ({
      ...prev,
      audience: value,
    }))
  }
/>
          </div>

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
)}
    </div>
  );
};

export default NotificationsPage;