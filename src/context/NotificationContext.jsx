import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(storedNotifications);
    
    // Calculate unread count
    const unread = storedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Update unread count
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Create interview notification
  const createInterviewNotification = (interviewData) => {
    const notification = {
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Interview scheduled with ${interviewData.candidateName} for ${new Date(interviewData.scheduledDate).toLocaleDateString()}`,
      priority: 'high',
      data: interviewData,
      action: 'view_interview'
    };
    
    return addNotification(notification);
  };

  // Create status update notification
  const createStatusUpdateNotification = (applicationData, newStatus) => {
    const statusMessages = {
      'reviewed': 'Application has been reviewed',
      'shortlisted': 'Candidate has been shortlisted',
      'scheduled_for_interview': 'Interview has been scheduled',
      'interviewed': 'Interview has been completed',
      'hired': 'Candidate has been hired',
      'rejected': 'Application has been rejected'
    };

    const notification = {
      type: 'status_update',
      title: 'Application Status Updated',
      message: `${statusMessages[newStatus]} for ${applicationData.candidateName}`,
      priority: 'medium',
      data: applicationData,
      action: 'view_application'
    };
    
    return addNotification(notification);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    createInterviewNotification,
    createStatusUpdateNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};