import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LocationMuteSection from '../sections/LocationMuteSection';
import TimerMuteSection from '../sections/TimerMuteSection';
import ContactExclusionsSection from '../sections/ContactExclusionsSection';

interface AutoMuteSettingsProps {
  onNavigateBack: () => void;
}

const AutoMuteSettings: React.FC<AutoMuteSettingsProps> = ({ onNavigateBack }) => {
  return (
    <div className="animate-slide-in">
      <button
        onClick={onNavigateBack}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors duration-200 ease-in-out flex items-center gap-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
      
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Auto-Mute Settings
      </h2>

      <div className="space-y-4">
        <LocationMuteSection />
        <TimerMuteSection />
        <ContactExclusionsSection />
      </div>
    </div>
  );
};

export default AutoMuteSettings;