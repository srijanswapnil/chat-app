import React from 'react';

const UserListItem = ({ user, handleFunction }) => {

  return (
    <div>
      <button
        onClick={handleFunction}
        className="flex items-center gap-4 w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-md shadow-md transition duration-300"
      >
        <img
          src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />

        <div className="text-left">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </button>
    </div>
  );
};

export default UserListItem;

