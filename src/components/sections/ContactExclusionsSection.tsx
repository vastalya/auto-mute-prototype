import React from 'react';
import { Users } from 'lucide-react';
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
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    const index = avatar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between text-lg font-medium mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-400" />
          <span>Exclude Contacts</span>
        </div>
        <ToggleSwitch
          checked={state.contactExclusions.enabled}
          onChange={handleToggle}
        />
      </div>

      {state.contactExclusions.enabled && (
        <div className="space-y-3 animate-fade-in">
          {state.contactExclusions.contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div
                  className={`h-10 w-10 ${getAvatarColor(contact.avatar || contact.name)} rounded-full flex items-center justify-center text-white font-bold text-sm mr-3`}
                >
                  {contact.avatar || contact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={contact.isExcluded}
                onChange={(checked) => handleContactToggle(contact.id, checked)}
              />
            </div>
          ))}
          
          <div className="mt-4">
            <button
              onClick={() => showNotification('Contact exclusions saved!')}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-md transition-colors duration-200"
            >
              Save Exclusions
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center">
            Excluded contacts can still reach you even when auto-mute is active.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactExclusionsSection;