import React from 'react'

function ChatLoading() {
  return (
    <div className="flex flex-col gap-3">
      {Array(6).fill(0).map((_, index) => (
        <div 
          key={index} 
          className="bg-gray-700 p-3 rounded-md animate-pulse flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatLoading

