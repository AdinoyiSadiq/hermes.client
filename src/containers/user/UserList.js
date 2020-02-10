import React, { useState } from 'react';

import UserItem from './UserItem';

const UserList = ({ authUserId, type, data, subscribeToNewMessages, subscribeToDeletedMessages }) => {
  const [active, setActive] = useState(false);
  return (
    <section className='user-list u-margin-top-1'>
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
                subscribeToDeletedMessages={subscribeToDeletedMessages}
                active={active}
                setActive={setActive}
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
                active={active}
                setActive={setActive}
              />
            );
          })
        )
      }
    </section>
  );
}

export default UserList;
