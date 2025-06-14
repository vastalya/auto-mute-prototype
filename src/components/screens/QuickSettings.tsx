import React from 'react';
import { Wifi, Bluetooth, VolumeX, Flashlight, MapPin, Moon } from 'lucide-react';
import { useAutoMute } from '../../contexts/AutoMuteContext';

interface QuickSettingsProps {
  onNavigateToSettings: () => void;
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ onNavigateToSettings }) => {
  const { state } = useAutoMute();

  const quickSettingsItems = [
    { icon: Wifi, label: 'Wi-Fi', color: 'text-blue-400' },
    { icon: Bluetooth, label: 'Bluetooth', color: 'text-blue-400' },
    { icon: Flashlight, label: 'Flashlight', color: 'text-yellow-400' },
    { icon: MapPin, label: 'Location', color: 'text-green-400' },
    { icon: Moon, label: 'Do Not Disturb', color: 'text-red-400' },
  ];

  const getActiveFeatures = () => {
    const features = [];
    if (state.locationMute.enabled) features.push('Location');
    if (state.timerMute.enabled) features.push('Timer');
    if (state.contactExclusions.enabled) features.push('Contacts');
    return features;
  };

  const activeFeatures = getActiveFeatures();

  return (
    <div className="animate-bounce-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400 neon-text animate-float">
        Quick Settings
      </h2>
      
      {state.isActive && (
        <div className="glass bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-gray-300 text-sm font-medium py-4 px-4 rounded-xl text-center mb-6 border-l-4 border-green-400 glow-green animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-heartbeat shadow-neon"></div>
            <span className="text-green-400 font-semibold">Auto-Mute Active</span>
          </div>
          {activeFeatures.length > 0 && (
            <div className="text-xs text-gray-400 animate-shimmer">
              Active: {activeFeatures.join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {quickSettingsItems.map((item, index) => (
          <div
            key={index}
            className="stagger-item bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 transition-all duration-300 cursor-pointer group magnetic ripple glass border border-gray-700/50"
          >
            <item.icon className={`h-8 w-8 ${item.color} mb-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-lg`} />
            <span className="text-sm font-medium group-hover:text-purple-300 transition-colors duration-300">
              {item.label}
            </span>
          </div>
        ))}
        
        <div
          className={`stagger-item ${
            state.isActive 
              ? 'bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-400 glow-green animate-glow' 
              : 'bg-gradient-to-br from-purple-700 to-purple-800 glow-purple'
          } text-white font-bold py-5 px-6 rounded-xl shadow-xl cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center group relative magnetic ripple liquid-button overflow-hidden`}
          onClick={onNavigateToSettings}
        >
          {state.isActive && (
            <>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
              {/* Particle effects */}
              <div className="particle" style={{ left: '20%', animationDelay: '0s' }}></div>
              <div className="particle" style={{ left: '50%', animationDelay: '0.5s' }}></div>
              <div className="particle" style={{ left: '80%', animationDelay: '1s' }}></div>
            </>
          )}
          <VolumeX className={`h-8 w-8 mb-2 group-hover:scale-125 transition-all duration-300 drop-shadow-lg ${state.isActive ? 'animate-wiggle' : ''}`} />
          <span className="text-sm font-medium">Auto-Mute</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;