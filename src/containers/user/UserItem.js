import React, { useEffect } from 'react';

import UserImage from '../../components/profile/UserImage';
import dateFormatter from '../../lib/dateFormatter';
import MessaginContext from '../../context/Messaging';

import camera__icon from '../../images/camera-icon.svg';

const UserItem = ({ 
    item: { user, profileImage, lastMessage }, 
    type, 
    authUserId, 
    subscribeToNewMessages, 
    subscribeToDeletedMessages,
    active,
    setActive,
  }) => {
  useEffect(() => {
    subscribeToNewMessages && 
    subscribeToNewMessages({ senderId: user.id, receiverId: authUserId });
    subscribeToDeletedMessages && 
    subscribeToDeletedMessages({ senderId: user.id, receiverId: authUserId });
  }, []);

  const renderUserDetails = ({ type, user, lastMessage }) => {
    if (type === 'activeChats') {
      return (
        <div className='user__details'>
          <div className='user__details--activechat'>
            <div className='user__details--name'>{`${user.firstname} ${user.lastname}`}</div>
            <div className='user__details--message'>
              {lastMessage.image && <img src={camera__icon} alt="camera"/>}
              {`${(lastMessage && lastMessage.text).slice(0, 22)}...`}
            </div>
          </div>
          <div>
            <div className='user__details--number u-hide'>12</div>
            <div className='user__details--time'>{dateFormatter(lastMessage.createdAt)}</div>
          </div>
        </div>
      );
    }

    return (
      <div className='user__details'>
        <div className='user__details--contact'>
          <div className='user__details--name'>{`${user.firstname} ${user.lastname}`}</div>
          <div className='user__details--lastseen'>Last seen: {dateFormatter(user.lastseen)}</div>
        </div>
      </div>
    );
  }

  return (
    <MessaginContext.Consumer>
      {({ setActiveUser }) => (
        <div 
          className={`user ${(active && active.userId && active.userId === user.id) && `user__details--active`}`}
          onClick={() => {
            setActiveUser({ ...user, profileImage  });
            setActive({ userId: user.id });
          }}>
          <UserImage user={{ ...user, profileImage }}/>
          {renderUserDetails({ type, user, lastMessage })}
        </div>
      )}
    </MessaginContext.Consumer>
  );
}

export default UserItem;
