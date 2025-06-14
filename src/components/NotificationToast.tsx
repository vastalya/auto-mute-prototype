import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
      default:
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
    }
  };

  const getGlowColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'shadow-glow-green';
      case 'error':
        return 'shadow-glow-red';
      case 'info':
        return 'shadow-glow-blue';
      default:
        return 'shadow-glow-green';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} ${getGlowColor(notification.type)} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] animate-bounce-in glass border border-white/20 backdrop-blur-sm`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative">
            {getIcon(notification.type)}
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white animate-ping" />
          </div>
          <span className="flex-1 text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white/80 hover:text-white transition-all duration-300 p-1 hover:bg-white/20 rounded-full magnetic"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;