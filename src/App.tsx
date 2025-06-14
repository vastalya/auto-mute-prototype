import React from 'react';
import { AutoMuteProvider } from './contexts/AutoMuteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import MobileFrame from './components/MobileFrame';

function App() {
  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen flex items-center justify-center font-inter">
      <NotificationProvider>
        <AutoMuteProvider>
          <MobileFrame />
        </AutoMuteProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;