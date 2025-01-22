import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomNav from '../../components/layout/BottomNav';

const UserList = () => {
  const users = [
    { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '09:30 AM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'See you tomorrow!', time: '08:45 AM' },
    // Add more users
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <Link
            key={user.id}
            to={`/chat/${user.id}`}
            className="block border-b last:border-b-0"
          >
            <div className="flex items-center space-x-3 p-4 hover:bg-gray-50">
              <Avatar>
                <AvatarImage src={`/avatars/${user.id}.jpg`} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <span className="text-sm text-gray-500">{user.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default UserList;