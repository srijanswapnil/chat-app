export const getSender=(loggedUser,users)=>{
    return users[0]._id === loggedUser._id?users[1].name :users[0].name
}

export const getSenderFull=(loggedUser,users)=>{
    return users[0]._id === loggedUser._id?users[1] :users[0]
}


export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 && 
      (messages[i + 1].sender._id !== m.sender._id || 
       messages[i + 1].sender._id === undefined) &&
      m.sender._id !== userId
    );
  };
  

  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 && 
      messages[i].sender._id !== userId && 
      messages[i].sender._id
    );
  };
  
  export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        m.sender._id !== userId
    ) {
        return "ml-10";  // left margin when same sender (to avoid space for profile pic)
    } else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            m.sender._id !== userId) ||
        (i === messages.length - 1 && m.sender._id !== userId)
    ) {
        return "ml-1";  // less left margin when sender changes
    } else {
        return "ml-auto"; // for user's own message (right align)
    }
};
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
