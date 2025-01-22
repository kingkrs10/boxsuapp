import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Toaster, toast } from '@/components/ui/toast';

const NotificationSettings = ({ settings, onUpdateSettings }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = async (key, value) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ [key]: value });
      toast({
        title: "Settings updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been updated`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      // Revert the switch state since the update failed
      onUpdateSettings({ [key]: !value });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Toaster />
      <h3 className="font-semibold">Notification Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Message Notifications</p>
            <p className="text-sm text-gray-500">Get notified when you receive messages</p>
          </div>
          <Switch
            checked={settings?.messageNotifications}
            onCheckedChange={(checked) => handleSettingChange('messageNotifications', checked)}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Group Notifications</p>
            <p className="text-sm text-gray-500">Get notified about group activity</p>
          </div>
          <Switch
            checked={settings?.groupNotifications}
            onCheckedChange={(checked) => handleSettingChange('groupNotifications', checked)}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sound</p>
            <p className="text-sm text-gray-500">Play sound for new messages</p>
          </div>
          <Switch
            checked={settings?.sound}
            onCheckedChange={(checked) => handleSettingChange('sound', checked)}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;