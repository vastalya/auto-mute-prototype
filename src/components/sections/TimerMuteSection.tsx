import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, Timer } from 'lucide-react';
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

  const getProgressPercentage = () => {
    const totalSeconds = timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="glass bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between text-lg font-medium mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Clock className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <span className="text-white">Mute by Timer</span>
        </div>
        <ToggleSwitch
          checked={state.timerMute.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.timerMute.enabled && (
        <div className="space-y-6 animate-zoom-in">
          {timeLeft > 0 && (
            <div className="text-center animate-bounce-in">
              <div className="relative mb-6">
                <div className="text-5xl font-mono font-bold text-blue-400 mb-2 neon-text animate-heartbeat">
                  {formatDisplayTime(timeLeft)}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                {isRunning && (
                  <div className="absolute -inset-4 bg-blue-500/10 rounded-full animate-ping"></div>
                )}
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePauseTimer}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 magnetic ripple shadow-lg"
                >
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleStopTimer}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 magnetic ripple shadow-lg"
                >
                  <Square className="h-5 w-5" />
                  Stop
                </button>
              </div>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="animate-slide-up">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hours:
                  </label>
                  <input
                    type="number"
                    value={timerInput.hours}
                    onChange={(e) => setTimerInput({ ...timerInput, hours: Math.max(0, Math.min(23, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="23"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm text-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minutes:
                  </label>
                  <input
                    type="number"
                    value={timerInput.minutes}
                    onChange={(e) => setTimerInput({ ...timerInput, minutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="59"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm text-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seconds:
                  </label>
                  <input
                    type="number"
                    value={timerInput.seconds}
                    onChange={(e) => setTimerInput({ ...timerInput, seconds: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                    min="0"
                    max="59"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm text-lg font-mono"
                  />
                </div>
              </div>
              
              <button
                onClick={handleStartTimer}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-3 magnetic ripple liquid-button glow-purple"
              >
                <Timer className="h-5 w-5 animate-spin" />
                Start Timer
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              Your device will be muted for the specified duration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerMuteSection;