import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';
import { useAutoMute } from '../../contexts/AutoMuteContext';
import { useNotification } from '../../contexts/NotificationContext';
import ToggleSwitch from '../ToggleSwitch';
import { Contact } from '../../types';

const ContactExclusionsSection: React.FC = () => {
  const { state, dispatch } = useAutoMute();
  const { showNotification } = useNotification();

  const handleToggle = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_CONTACT_EXCLUSIONS', payload: enabled });
    showNotification(
      enabled ? 'Contact exclusions enabled' : 'Contact exclusions disabled'
    );
  };

  const handleContactToggle = (contactId: string, isExcluded: boolean) => {
    const updatedContacts = state.contactExclusions.contacts.map(contact =>
      contact.id === contactId ? { ...contact, isExcluded } : contact
    );
    dispatch({ type: 'UPDATE_CONTACTS', payload: updatedContacts });
    
    const contact = state.contactExclusions.contacts.find(c => c.id === contactId);
    showNotification(
      isExcluded 
        ? `${contact?.name} will not be muted` 
        : `${contact?.name} will be muted`
    );
  };

  const getAvatarColor = (avatar: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600', 
      'bg-gradient-to-br from-green-500 to-green-600', 
      'bg-gradient-to-br from-red-500 to-red-600', 
      'bg-gradient-to-br from-yellow-500 to-yellow-600', 
      'bg-gradient-to-br from-purple-500 to-purple-600', 
      'bg-gradient-to-br from-pink-500 to-pink-600'
    ];
    const index = avatar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const excludedCount = state.contactExclusions.contacts.filter(c => c.isExcluded).length;

  return (
    <div className="glass bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center justify-between text-lg font-medium mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Users className="h-6 w-6 text-orange-400 animate-pulse" />
          </div>
          <div>
            <span className="text-white">Exclude Contacts</span>
            {excludedCount > 0 && (
              <div className="text-xs text-orange-400 mt-1">
                {excludedCount} contact{excludedCount !== 1 ? 's' : ''} excluded
              </div>
            )}
          </div>
        </div>
        <ToggleSwitch
          checked={state.contactExclusions.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.contactExclusions.enabled && (
        <div className="space-y-4 animate-zoom-in">
          {state.contactExclusions.contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="stagger-item flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl hover:from-gray-600/50 hover:to-gray-700/50 transition-all duration-300 glass border border-gray-600/30 hover:border-orange-500/50 magnetic"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={`h-12 w-12 ${getAvatarColor(contact.avatar || contact.name)} rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-lg`}
                  >
                    {contact.avatar || contact.name.charAt(0)}
                  </div>
                  {contact.isExcluded && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                  {contact.isExcluded && (
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      Can reach you
                    </p>
                  )}
                </div>
              </div>
              <ToggleSwitch
                checked={contact.isExcluded}
                onChange={(checked) => handleContactToggle(contact.id, checked)}
              />
            </div>
          ))}
          
          <div className="mt-6">
            <button
              onClick={() => showNotification('Contact exclusions saved!')}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl text-white font-medium shadow-lg transition-all duration-300 magnetic ripple liquid-button"
            >
              Save Exclusions
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
              Excluded contacts can still reach you even when auto-mute is active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactExclusionsSection;