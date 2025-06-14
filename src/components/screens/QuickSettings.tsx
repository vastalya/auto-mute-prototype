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

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Quick Settings
      </h2>
      
      {state.isActive && (
        <div className="bg-gray-700 text-gray-300 text-sm font-medium py-2 px-4 rounded-full text-center mb-6">
          Auto-Mute: <span className="text-green-400">Active</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {quickSettingsItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
          >
            <item.icon className={`h-8 w-8 ${item.color} mb-2 group-hover:scale-110 transition-transform duration-200`} />
            <span className="text-sm font-medium group-hover:text-purple-300 transition-colors duration-200">
              {item.label}
            </span>
          </div>
        ))}
        
        <div
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-5 px-6 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center group"
          onClick={onNavigateToSettings}
        >
          <VolumeX className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">Auto-Mute</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;