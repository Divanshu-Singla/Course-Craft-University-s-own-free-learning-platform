import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("/api/users/notifications/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `/api/users/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        "/api/users/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `/api/users/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border transition-all ${
                notification.isRead
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold ${
                      notification.isRead ? "text-gray-700" : "text-gray-900"
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  {notification.reason && (
                    <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Reason:</strong> {notification.reason}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
