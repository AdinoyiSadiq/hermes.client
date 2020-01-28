import React from 'react';

import UserItem from './UserItem';

const UserList = ({ authUserId, type, data, subscribeToNewMessages }) => {
  return (
    <section className='user-list'>
      {
        (type === 'activeChats') ?  (
            data && data.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt)
            .map((item) => {
            return (
              <UserItem
                key={item.id}
                item={item}
                type={type}
                authUserId={authUserId}
                subscribeToNewMessages={subscribeToNewMessages}
              />
            );
          })
        ) : (
          data.map((item) => {
            return (
              <UserItem
                key={item.id}
                item={item}
                type={type}
              />
            );
          })
        )
      }
    </section>
  );
}

export default UserList;
