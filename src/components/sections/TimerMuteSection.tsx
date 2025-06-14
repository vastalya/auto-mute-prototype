import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { useAutoMute } from '../../contexts/AutoMuteContext';
import { useNotification } from '../../contexts/NotificationContext';
import ToggleSwitch from '../ToggleSwitch';
import { TimerSettings } from '../../types';

const TimerMuteSection: React.FC = () => {
  const { state, dispatch } = useAutoMute();
  const { showNotification } = useNotification();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInput, setTimerInput] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            showNotification('Timer completed! Device unmuted.');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showNotification]);

  const handleToggle = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_TIMER_MUTE', payload: enabled });
    if (!enabled) {
      setIsRunning(false);
      setTimeLeft(0);
    }
    showNotification(
      enabled ? 'Timer-based muting enabled' : 'Timer-based muting disabled'
    );
  };

  const handleStartTimer = () => {
    const totalSeconds = timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    
    if (totalSeconds === 0) {
      showNotification('Please set a valid timer duration', 'error');
      return;
    }

    const settings: TimerSettings = {
      ...timerInput,
      isActive: true,
      startTime: new Date(),
      endTime: new Date(Date.now() + totalSeconds * 1000),
    };

    dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: settings });
    setTimeLeft(totalSeconds);
    setIsRunning(true);
    showNotification(`Timer started for ${formatTime(totalSeconds)}`);
  };

  const handlePauseTimer = () => {
    setIsRunning(!isRunning);
    showNotification(isRunning ? 'Timer paused' : 'Timer resumed');
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    showNotification('Timer stopped');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDisplayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between text-lg font-medium mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <span>Mute by Timer</span>
        </div>
        <ToggleSwitch
          checked={state.timerMute.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.timerMute.enabled && (
        <div className="space-y-4 animate-fade-in">
          {timeLeft > 0 && (
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-purple-400 mb-2">
                {formatDisplayTime(timeLeft)}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={handlePauseTimer}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleStopTimer}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </button>
              </div>
            </div>
          )}

          {timeLeft === 0 && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hours:
                  </label>
                  <input
                    type="number"
                    value={timerInput.hours}
                    onChange={(e) => setTimerInput({ ...timerInput, hours: Math.max(0, Math.min(23, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="23"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Minutes:
                  </label>
                  <input
                    type="number"
                    value={timerInput.minutes}
                    onChange={(e) => setTimerInput({ ...timerInput, minutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="59"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Seconds:
                  </label>
                  <input
                    type="number"
                    value={timerInput.seconds}
                    onChange={(e) => setTimerInput({ ...timerInput, seconds: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="59"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleStartTimer}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Timer
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 text-center">
            Your device will be muted for the specified duration.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimerMuteSection;