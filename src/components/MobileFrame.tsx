import React, { useState } from 'react';
import StatusBar from './StatusBar';
import QuickSettings from './screens/QuickSettings';
import AutoMuteSettings from './screens/AutoMuteSettings';
import NotificationToast from './NotificationToast';
import { Screen } from '../types';

const MobileFrame: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchScreen = (screen: Screen) => {
    if (isTransitioning || currentScreen === screen) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />
      
      <div className="flex-grow bg-gray-900 p-4 overflow-y-auto">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          {currentScreen === 'main' && (
            <QuickSettings onNavigateToSettings={() => switchScreen('settings')} />
          )}
          {currentScreen === 'settings' && (
            <AutoMuteSettings onNavigateBack={() => switchScreen('main')} />
          )}
        </div>
      </div>
      
      <NotificationToast />
    </div>
  );
};

export default MobileFrame;