import React from 'react';
import UserItem from './UserItem';

const UserList = ({ authUserId, type, view, data, users, subscribeToNewMessages, subscribeToDeletedMessages, subscribeToAcceptedContacts }) => {
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
                active={true}
              />
            );
          })
        ) : (
          <div>
            <div className='user-list-title'>{type === 'search' && view === 'contactList' && data && data.length >= 1 && 'Contacts'}</div>
            {
              data.map((item) => {
                return (
                  <UserItem
                    key={item.id || item.user.id}
                    item={item}
                    type={type}
                    authUserId={authUserId}
                    subscribeToNewMessages={subscribeToNewMessages}
                    subscribeToAcceptedContacts={subscribeToAcceptedContacts}
                  />
                );
              })
            }
            <div className='user-list-title'>{type === 'search' && view === 'contactList' && users && users.length >= 1 && 'Users'}</div>
            <div>
              {
                users && users.map((item) => {
                  return (
                    <UserItem
                      key={item.id || item.user.id}
                      item={item}
                    />
                  )
                })
              }
            </div>
          </div>
        )
      }
    </section>
  );
}

export default UserList;
