import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ChatSettings = ({ chat, onUpdateSettings, onLeaveChat, onBlockUser }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = async (key, value) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ [key]: value });
      toast({
        title: "Settings updated",
        description: `Chat ${key} has been ${value ? 'enabled' : 'disabled'}`,
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

  const handleLeaveChat = async () => {
    try {
      await onLeaveChat();
      toast({
        title: "Left chat",
        description: "You have successfully left the chat",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBlockUser = async () => {
    try {
      await onBlockUser();
      toast({
        title: "User blocked",
        description: "You have blocked this user",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Toaster />
      <div className="space-y-4">
        <h3 className="font-semibold">Chat Settings</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch
              checked={chat?.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Message Sound</span>
            <Switch
              checked={chat?.messageSound}
              onCheckedChange={(checked) => handleSettingChange('messageSound', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600"
              >
                Block User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Block User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to block this user? You won't receive their messages anymore.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBlockUser} className="bg-red-600">
                  Block User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600"
              >
                Leave Chat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Chat</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this chat? You won't be able to see any future messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveChat} className="bg-red-600">
                  Leave Chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;