import { useState, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  User,
  Mail,
  Building2,
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, interviews, status
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview_scheduled':
        return Calendar;
      case 'status_update':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600';
    if (priority === 'medium') return 'text-blue-600';
    if (priority === 'low') return 'text-gray-600';
    
    switch (type) {
      case 'interview_scheduled':
        return 'text-purple-600';
      case 'status_update':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'interviews') return notification.type === 'interview_scheduled';
    if (filter === 'status') return notification.type === 'status_update';
    return true;
  });

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.action === 'view_interview') {
      // Navigate to interview details or candidate profile
      navigate(`/candidate-profile/${notification.data.candidateId}`);
    } else if (notification.action === 'view_application') {
      // Navigate to application details
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-300">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye size={16} className="mr-2" />
                  Mark All Read
                </Button>
              )}
              
              {notifications.length > 0 && (
                <Button
                  onClick={clearAllNotifications}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'interviews', label: 'Interviews', count: notifications.filter(n => n.type === 'interview_scheduled').length },
              { key: 'status', label: 'Status Updates', count: notifications.filter(n => n.type === 'status_update').length }
            ].map((tab) => (
              <Button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                variant={filter === tab.key ? "default" : "outline"}
                className={`${
                  filter === tab.key 
                    ? 'bg-blue-600 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <Bell size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Notifications</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isInterview = notification.type === 'interview_scheduled';
              
              return (
                <Card 
                  key={notification.id} 
                  className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                    !notification.read ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        !notification.read ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Interview Details */}
                        {isInterview && notification.data && (
                          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-sm font-semibold text-white mb-3">Interview Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Calendar size={16} className="text-blue-400" />
                                <span>
                                  {new Date(notification.data.scheduledDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-300">
                                <Clock size={16} className="text-green-400" />
                                <span>
                                  {new Date(notification.data.scheduledDate).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} ({notification.data.duration} min)
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-300">
                                {notification.data.type === 'video' && <Video size={16} className="text-blue-400" />}
                                {notification.data.type === 'phone' && <Phone size={16} className="text-green-400" />}
                                {notification.data.type === 'in-person' && <MapPin size={16} className="text-red-400" />}
                                {notification.data.type === 'panel' && <Users size={16} className="text-purple-400" />}
                                <span className="capitalize">{notification.data.type} Interview</span>
                              </div>
                              
                              {notification.data.location && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <MapPin size={16} className="text-red-400" />
                                  <span>{notification.data.location}</span>
                                </div>
                              )}
                              
                              {notification.data.meetingLink && (
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Video size={16} className="text-blue-400" />
                                  <a 
                                    href={notification.data.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                  >
                                    Join Meeting
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <Eye size={14} />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
