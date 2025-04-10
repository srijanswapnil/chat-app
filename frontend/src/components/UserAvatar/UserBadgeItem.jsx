import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'  // Importing Close Icon

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      className="px-2 py-1 m-1 rounded-full bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
      onClick={handleFunction}
    >
      <span>{user.name}</span>
      <AiOutlineClose size={15} />
    </div>
  )
}

export default UserBadgeItem


