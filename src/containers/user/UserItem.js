import React, { useEffect } from 'react';

import UserImage from '../../components/profile/UserImage';
import dateFormatter from '../../lib/dateFormatter';
import formatText from '../../lib/formatText';
import MessaginContext from '../../context/Messaging';

import camera__icon from '../../images/camera-icon.svg';

const UserItem = ({ 
    item: { user, status, actionUserId, contact, profileImage, lastMessage, unreadMessages }, 
    type, 
    authUserId, 
    subscribeToNewMessages, 
    subscribeToDeletedMessages,
    setActive,
  }) => {
  useEffect(() => {
    subscribeToNewMessages && 
    subscribeToNewMessages({ senderId: user.id, receiverId: authUserId });
    subscribeToDeletedMessages && 
    subscribeToDeletedMessages({ senderId: user.id, receiverId: authUserId });
  }, []);

  const renderUserDetails = ({ type, user, lastMessage, isActiveUser }) => {
    if (type === 'activeChats') {
      return (
        <div className='user__details'>
          <div className='user__details--activechat'>
            <div className='user__details--name'>{`${formatText(user.firstname)} ${formatText(user.lastname)}`}</div>
            <div className='user__details--message'>
              {lastMessage.image && <img src={camera__icon} alt="camera"/>}
              {(lastMessage && lastMessage.text) && `${(lastMessage.text).slice(0, 22)}${(lastMessage.text.length > 22) ? '...' : ''}`}
            </div>
          </div>
          <div>
            <div className={`user__details--number ${(unreadMessages === 0 || (isActiveUser && isActiveUser.id && isActiveUser.id === user.id)) && 'u-hide'}`}>
              {`${unreadMessages}`}
            </div>
            <div className='user__details--time'>{dateFormatter(lastMessage.createdAt)}</div>
          </div>
        </div>
      );
    }

    return (
      <div className='user__details'>
        <div className='user__details--contact'>
          <div className='user__details--name'>{`${formatText(user.firstname)} ${formatText(user.lastname)}`}</div>
          <div className='user__details--lastseen'>Last seen: {dateFormatter(user.lastseen)}</div>
        </div>
      </div>
    );
  }

  return (
    <MessaginContext.Consumer>
      {({ setActiveUser, isActiveUser }) => (
        <div 
          className={`user ${(isActiveUser && isActiveUser.id && isActiveUser.id === user.id) && `user__details--active`}`}
          onClick={() => { setActiveUser({ ...user, status, actionUserId, contact, profileImage  }) }}>
          <UserImage user={{ ...user, profileImage }}/>
          {renderUserDetails({ type, user, lastMessage, isActiveUser })}
        </div>
      )}
    </MessaginContext.Consumer>
  );
}

export default UserItem;
