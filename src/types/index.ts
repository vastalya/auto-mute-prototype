export interface Location {
  id: string;
  address: string;
  name?: string;
  radius: number;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isExcluded: boolean;
}

export interface TimerSettings {
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
}

export interface AutoMuteSettings {
  locationMute: {
    enabled: boolean;
    locations: Location[];
  };
  timerMute: {
    enabled: boolean;
    settings: TimerSettings;
  };
  contactExclusions: {
    enabled: boolean;
    contacts: Contact[];
  };
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type Screen = 'main' | 'settings';