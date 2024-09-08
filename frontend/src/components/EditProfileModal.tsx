import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface User {
  name: string;
  bio: string;
  avatar: string;
}

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ name, bio, avatar });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-indigo-900 rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500">
              <Image
                src={avatar}
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-indigo-700 text-white text-sm rounded hover:bg-indigo-600 transition-colors duration-300"
            >
              Change Avatar
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-indigo-200 mb-1 text-sm">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-indigo-800 text-white rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-indigo-200 mb-1 text-sm">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 bg-indigo-800 text-white rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-300 h-24 resize-none"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-800 text-white rounded hover:bg-indigo-700 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
