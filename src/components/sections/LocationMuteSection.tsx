import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Map, Navigation } from 'lucide-react';
import { useAutoMute } from '../../contexts/AutoMuteContext';
import { useNotification } from '../../contexts/NotificationContext';
import ToggleSwitch from '../ToggleSwitch';
import { Location } from '../../types';

const LocationMuteSection: React.FC = () => {
  const { state, dispatch } = useAutoMute();
  const { showNotification } = useNotification();
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [newLocation, setNewLocation] = useState({
    address: '',
    name: '',
    radius: 100,
  });

  const handleToggle = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_LOCATION_MUTE', payload: enabled });
    showNotification(
      enabled ? 'Location-based muting enabled' : 'Location-based muting disabled'
    );
  };

  const handleAddLocation = () => {
    if (!newLocation.address.trim()) {
      showNotification('Please enter an address', 'error');
      return;
    }

    const location: Location = {
      id: Date.now().toString(),
      address: newLocation.address,
      name: newLocation.name || undefined,
      radius: newLocation.radius,
      isActive: true,
    };

    dispatch({ type: 'ADD_LOCATION', payload: location });
    showNotification('Location saved successfully!');
    
    setNewLocation({ address: '', name: '', radius: 100 });
    setShowAddLocation(false);
  };

  const handleRemoveLocation = (id: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: id });
    showNotification('Location removed');
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          showNotification('Using current location for auto-mute!');
          // In a real app, you'd reverse geocode the coordinates to get an address
        },
        (error) => {
          showNotification('Unable to get current location', 'error');
        }
      );
    } else {
      showNotification('Geolocation not supported', 'error');
    }
  };

  return (
    <div className="glass bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between text-lg font-medium mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <MapPin className="h-6 w-6 text-green-400 animate-pulse" />
          </div>
          <span className="text-white">Mute by Location</span>
        </div>
        <ToggleSwitch
          checked={state.locationMute.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.locationMute.enabled && (
        <div className="space-y-6 animate-zoom-in">
          {!showAddLocation ? (
            <button
              onClick={() => setShowAddLocation(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-3 magnetic ripple liquid-button glow-purple"
            >
              <Plus className="h-5 w-5 animate-bounce" />
              Add New Location
            </button>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter Address:
                  </label>
                  <input
                    type="text"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                    placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Name (Optional):
                  </label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    placeholder="e.g., Office, Library, Home"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mute Radius (meters):
                  </label>
                  <input
                    type="number"
                    value={newLocation.radius}
                    onChange={(e) => setNewLocation({ ...newLocation, radius: parseInt(e.target.value) || 100 })}
                    min="50"
                    max="5000"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 glass backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleUseCurrentLocation}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 magnetic ripple"
                >
                  <Navigation className="h-4 w-4" />
                  Current Location
                </button>
                <button
                  onClick={() => setShowMapView(!showMapView)}
                  className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 magnetic ripple"
                >
                  <Map className="h-4 w-4" />
                  {showMapView ? 'Hide Map' : 'Show Map'}
                </button>
              </div>

              {showMapView && (
                <div className="animate-flip">
                  <p className="text-sm text-gray-400 mb-3 text-center">
                    Tap on the map to set the mute zone.
                  </p>
                  <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-glow">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15302.26033324128!2d80.43577785!3d16.30018515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a75510252637b%3A0x4a75c1a7b458850!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddLocation}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 magnetic ripple liquid-button"
                >
                  Save Location
                </button>
                <button
                  onClick={() => {
                    setShowAddLocation(false);
                    setShowMapView(false);
                    setNewLocation({ address: '', name: '', radius: 100 });
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 magnetic ripple"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {state.locationMute.locations.length > 0 && (
            <div className="animate-slide-up">
              <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-400" />
                Saved Locations:
              </h4>
              <div className="space-y-3">
                {state.locationMute.locations.map((location, index) => (
                  <div
                    key={location.id}
                    className="stagger-item flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl text-sm glass border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 magnetic"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {location.name ? `${location.name} (${location.address})` : location.address}
                      </div>
                      <div className="text-gray-400 text-xs mt-1 flex items-center gap-2">
                        <span>Radius: {location.radius}m</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveLocation(location.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300 magnetic"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              When your device enters these areas, it will automatically mute.
              It will unmute when you leave.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMuteSection;