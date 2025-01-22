import React from 'react';
import { User, UserPlus, Settings } from 'lucide-react';

const GroupChat = ({ group, members, onAddMember, onSettings }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Group Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group?.avatar} />
            <AvatarFallback>{group?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">{group?.name}</h2>
            <p className="text-sm text-gray-500">{members?.length} members</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={onAddMember}>
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-medium mb-3">Group Members</h3>
        <div className="space-y-2">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role || 'Member'}</p>
              </div>
              {member.isAdmin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Group Settings Summary */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Group created on {group?.createdAt}</span>
          <Button variant="ghost" size="sm" className="text-blue-600">
            View More Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ChatDetail, GroupChat };