import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-6 bg-gray-800 flex justify-between items-center px-3 text-xs text-gray-300 border-t-[30px] border-transparent">
      <span className="font-medium">{formatTime(currentTime)}</span>
      <div className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-3 w-3" />
        <span className="text-xs">85%</span>
      </div>
    </div>
  );
};

export default StatusBar;