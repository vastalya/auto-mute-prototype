import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
        className="mb-6 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg text-white font-medium transition-all duration-300 ease-in-out flex items-center gap-2 magnetic ripple glass border border-gray-600/50 shadow-lg"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
        Back
      </button>
      
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-8 w-8 text-purple-400 animate-spin-slow" />
        <h2 className="text-3xl font-bold text-center text-purple-400 neon-text animate-float">
          Auto-Mute Settings
        </h2>
        <Sparkles className="h-8 w-8 text-purple-400 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="space-y-6">
        <div className="stagger-item">
          <LocationMuteSection />
        </div>
        <div className="stagger-item">
          <TimerMuteSection />
        </div>
        <div className="stagger-item">
          <ContactExclusionsSection />
        </div>
      </div>
    </div>
  );
};

export default AutoMuteSettings;