import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const recentNotifications = notifications.slice(0, 5); // Show only 5 most recent

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    if (notification.action === 'view_interview') {
      navigate(`/candidate-profile/${notification.data.candidateId}`);
    } else if (notification.action === 'view_application') {
      navigate(`/application-status/${notification.data._id}`);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview_scheduled':
        return '📅';
      case 'status_update':
        return '✅';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:bg-white/10 p-2"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl shadow-black/50 z-50 max-h-96 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative">
            {/* Header */}
            <div className="p-4 border-b border-white/20 bg-black/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-1"
                >
                  <X size={16} />
                </Button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-300 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-500/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-white' : 'text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1 ml-2 flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/20 bg-black/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                  className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
