import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AutoMuteSettings, Location, Contact, TimerSettings } from '../types';

interface AutoMuteState extends AutoMuteSettings {
  isActive: boolean;
  currentLocation?: { latitude: number; longitude: number };
}

type AutoMuteAction =
  | { type: 'TOGGLE_LOCATION_MUTE'; payload: boolean }
  | { type: 'TOGGLE_TIMER_MUTE'; payload: boolean }
  | { type: 'TOGGLE_CONTACT_EXCLUSIONS'; payload: boolean }
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'UPDATE_TIMER_SETTINGS'; payload: TimerSettings }
  | { type: 'UPDATE_CONTACTS'; payload: Contact[] }
  | { type: 'UPDATE_CURRENT_LOCATION'; payload: { latitude: number; longitude: number } }
  | { type: 'SET_ACTIVE_STATUS'; payload: boolean };

const initialState: AutoMuteState = {
  isActive: false,
  locationMute: {
    enabled: false,
    locations: [
      {
        id: '1',
        address: 'VVIT, Nambur, Andhra Pradesh, India',
        name: 'College',
        radius: 100,
        isActive: true,
      },
      {
        id: '2',
        address: '123 Market St',
        name: 'City Center',
        radius: 150,
        isActive: true,
      },
      {
        id: '3',
        address: '123 Main St',
        name: 'Home',
        radius: 200,
        isActive: true,
      },
    ],
  },
  timerMute: {
    enabled: false,
    settings: {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isActive: false,
    },
  },
  contactExclusions: {
    enabled: false,
    contacts: [
      {
        id: '1',
        name: 'John Doe',
        phone: '555-1234',
        avatar: 'JD',
        isExcluded: false,
      },
      {
        id: '2',
        name: 'Jane Appleseed',
        phone: '555-5678',
        avatar: 'JA',
        isExcluded: false,
      },
      {
        id: '3',
        name: 'Sam Miller',
        phone: '555-9012',
        avatar: 'SM',
        isExcluded: false,
      },
    ],
  },
};

function autoMuteReducer(state: AutoMuteState, action: AutoMuteAction): AutoMuteState {
  switch (action.type) {
    case 'TOGGLE_LOCATION_MUTE':
      return {
        ...state,
        locationMute: {
          ...state.locationMute,
          enabled: action.payload,
        },
      };
    case 'TOGGLE_TIMER_MUTE':
      return {
        ...state,
        timerMute: {
          ...state.timerMute,
          enabled: action.payload,
        },
      };
    case 'TOGGLE_CONTACT_EXCLUSIONS':
      return {
        ...state,
        contactExclusions: {
          ...state.contactExclusions,
          enabled: action.payload,
        },
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        locationMute: {
          ...state.locationMute,
          locations: [...state.locationMute.locations, action.payload],
        },
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        locationMute: {
          ...state.locationMute,
          locations: state.locationMute.locations.filter(loc => loc.id !== action.payload),
        },
      };
    case 'UPDATE_TIMER_SETTINGS':
      return {
        ...state,
        timerMute: {
          ...state.timerMute,
          settings: action.payload,
        },
      };
    case 'UPDATE_CONTACTS':
      return {
        ...state,
        contactExclusions: {
          ...state.contactExclusions,
          contacts: action.payload,
        },
      };
    case 'UPDATE_CURRENT_LOCATION':
      return {
        ...state,
        currentLocation: action.payload,
      };
    case 'SET_ACTIVE_STATUS':
      return {
        ...state,
        isActive: action.payload,
      };
    default:
      return state;
  }
}

interface AutoMuteContextType {
  state: AutoMuteState;
  dispatch: React.Dispatch<AutoMuteAction>;
}

const AutoMuteContext = createContext<AutoMuteContextType | undefined>(undefined);

export function AutoMuteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(autoMuteReducer, initialState);

  // Update active status based on enabled features
  useEffect(() => {
    const isActive = state.locationMute.enabled || state.timerMute.enabled;
    dispatch({ type: 'SET_ACTIVE_STATUS', payload: isActive });
  }, [state.locationMute.enabled, state.timerMute.enabled]);

  // Simulate location tracking
  useEffect(() => {
    if (state.locationMute.enabled && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          dispatch({
            type: 'UPDATE_CURRENT_LOCATION',
            payload: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [state.locationMute.enabled]);

  return (
    <AutoMuteContext.Provider value={{ state, dispatch }}>
      {children}
    </AutoMuteContext.Provider>
  );
}

export function useAutoMute() {
  const context = useContext(AutoMuteContext);
  if (context === undefined) {
    throw new Error('useAutoMute must be used within an AutoMuteProvider');
  }
  return context;
}