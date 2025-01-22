import React, { useState } from 'react';
import { Smile, ThumbsUp, Heart, Star } from 'lucide-react';

const MessageReactions = ({ message, onReact }) => {
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { emoji: '👍', Icon: ThumbsUp },
    { emoji: '❤️', Icon: Heart },
    { emoji: '⭐', Icon: Star },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Smile className="h-4 w-4" />
      </button>

      {showReactions && (
        <div className="absolute bottom-full mb-2 flex space-x-1 bg-white shadow-lg rounded-full p-1">
          {reactions.map(({ emoji, Icon }) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setShowReactions(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};