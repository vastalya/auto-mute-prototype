import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
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
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between text-lg font-medium mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-400" />
          <span>Mute by Location</span>
        </div>
        <ToggleSwitch
          checked={state.locationMute.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.locationMute.enabled && (
        <div className="space-y-4 animate-fade-in">
          {!showAddLocation ? (
            <button
              onClick={() => setShowAddLocation(true)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Location
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Enter Address:
                </label>
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location Name (Optional):
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="e.g., Office, Library, Home"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mute Radius (meters):
                </label>
                <input
                  type="number"
                  value={newLocation.radius}
                  onChange={(e) => setNewLocation({ ...newLocation, radius: parseInt(e.target.value) || 100 })}
                  min="50"
                  max="5000"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUseCurrentLocation}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200"
                >
                  Use Current Location
                </button>
                <button
                  onClick={() => setShowMapView(!showMapView)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200"
                >
                  {showMapView ? 'Hide Map' : 'Show Map'}
                </button>
              </div>

              {showMapView && (
                <div className="animate-fade-in">
                  <p className="text-sm text-gray-400 mb-2">
                    Tap on the map to set the mute zone.
                  </p>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15302.26033324128!2d80.43577785!3d16.30018515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a75510252637b%3A0x4a75c1a7b458850!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="192"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg border border-gray-600"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddLocation}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200"
                >
                  Save Location
                </button>
                <button
                  onClick={() => {
                    setShowAddLocation(false);
                    setShowMapView(false);
                    setNewLocation({ address: '', name: '', radius: 100 });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {state.locationMute.locations.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-300 mb-2">
                Saved Locations:
              </h4>
              <div className="space-y-2">
                {state.locationMute.locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg text-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {location.name ? `${location.name} (${location.address})` : location.address}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Radius: {location.radius}m
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveLocation(location.id)}
                      className="text-red-400 hover:text-red-500 p-1 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-400 text-center">
            When your device enters these areas, it will automatically mute.
            It will unmute when you leave.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationMuteSection;