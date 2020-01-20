import React from 'react';

import UserImage from '../../components/profile/UserImage';
import dateFormatter from '../../lib/dateFormatter';
import MessaginContext from '../../context/Messaging';

const UserList = ({ type, data }) => {
  const renderUserDetails = ({ type, user, lastMessage }) => {
    if (type === 'activeChats') {
      return (
        <div className='user__details'>
          <div className='user__details--activechat'>
            <div className='user__details--name'>{`${user.firstname} ${user.lastname}`}</div>
            <div className='user__details--message'>{`${(lastMessage && lastMessage.text).slice(0, 22)}...`}</div>
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

  const User = ({ item: { user, profileImage, lastMessage } }) => {
    return (
      <MessaginContext.Consumer>
        {({ setActiveUser }) => (
          <div 
            className='user u-margin-top-2'
            onClick={() => setActiveUser({ ...user, profileImage  })}>
            <UserImage user={{ ...user, profileImage }}/>
            {renderUserDetails({ type, user, lastMessage })}
          </div>
        )}
      </MessaginContext.Consumer>
    );
  }

  return (
    <section className='user-list'>
      {
        data.map((item) => {
          return (
            <User 
              key={item.id}
              item={item}
            />
          );
        })
      }
    </section>
  );
}

export default UserList;
