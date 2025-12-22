import React, { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

/**
 * NotificationCenter Component
 * Displays notifications with unread counts
 * Accessible via bell icon in header
 */
const NotificationCenter = ({ className }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - replace with real service
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'success',
        title: 'Course Completed',
        message: 'You completed "Introduction to Computer Science"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        action: { label: 'View', path: '/courses' }
      },
      {
        id: '2',
        type: 'info',
        title: 'New Course Available',
        message: 'A new course has been added to your school',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        action: { label: 'Explore', path: '/courses' }
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Level Up!',
        message: 'You reached Level 5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
      case 'achievement':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
      case 'achievement':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative focus-ring', className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-red-600"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 glass-effect-enhanced border-slate-600/50"
      >
        <div className="p-4 border-b border-slate-600/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-slate-400 hover:text-slate-300 h-auto p-0"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = !notification.read;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-3 rounded-lg transition-colors cursor-pointer',
                      isUnread 
                        ? 'bg-slate-700/50 border-l-2 border-blue-500' 
                        : 'bg-slate-800/30 hover:bg-slate-700/30'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', getNotificationColor(notification.type))} aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={cn('text-sm font-medium', isUnread ? 'text-white' : 'text-slate-300')}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" aria-label="Unread" />
                          )}
                        </div>
                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-6 text-xs text-blue-400 hover:text-blue-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to action path
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-600/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-400 hover:text-slate-300"
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;

