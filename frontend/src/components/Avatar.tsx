import React from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa6';

interface AvatarProps {
  user: {
    avatarUrl?: string;
    username: string;
  };
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
      {user.avatarUrl ? (
        <Image src={user.avatarUrl} alt={user.username} width={40} height={40} />
      ) : (
        <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
          <FaUser size={24} color="#818cf8" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
