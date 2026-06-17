import { useState } from 'react';
import {
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineCheck,
} from 'react-icons/hi';

import '../../styles/NotificationsPage.css';

const initialNotifications = [
  {
    id: 1,
    title: 'Platform Maintenance',
    message:
      'Platform maintenance scheduled on Sunday at 2:00 AM.',
    audience: 'All Students',
    priority: 'warning',
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
            <h2>
              Add Notification
            </h2>

            <div className="form-group">
              <label>
                Title
              </label>

              <input
                value={
                  form.title
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      title:
                        e
                          .target
                          .value,
                    })
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Message
              </label>

              <textarea
                rows="4"
                value={
                  form.message
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      message:
                        e
                          .target
                          .value,
                    })
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Audience
              </label>

              <select
                value={
                  form.audience
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      audience:
                        e
                          .target
                          .value,
                    })
                  )
                }
              >
                <option>
                  All Students
                </option>

                <option>
                  Class 10
                </option>

                <option>
                  Class 11
                </option>

                <option>
                  Class 12
                </option>

                <option>
                  JEE Students
                </option>

                <option>
                  NEET Students
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Priority
              </label>

              <select
                value={
                  form.priority
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      priority:
                        e
                          .target
                          .value,
                    })
                  )
                }
              >
                <option value="info">
                  Info
                </option>

                <option value="success">
                  Success
                </option>

                <option value="warning">
                  Warning
                </option>

                <option value="urgent">
                  Urgent
                </option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreate
                }
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;