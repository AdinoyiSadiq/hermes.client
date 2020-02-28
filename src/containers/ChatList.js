import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import SearchBox from '../components/search/SearchBox';
import NavButton from '../components/buttons/NavButton';
import UserList from './user/UserList';
import UserProfile from './user/UserProfile';
import Loader from '../components/loaders/Loader';
import errorHandler from '../lib/errorHandler';

import profile__icon from '../images/profile-icon.svg';

import GET_ALL_CONTACTS from '../queries/getAllContacts';
import GET_ACTIVE_CHATS from '../queries/getActiveChats';
import SEARCH_CONTACTS from '../queries/searchContacts';
import MESSAGE_SUBSCRIPTION from '../subscriptions/messageSubscription';
import DELETED_MESSAGE_SUBSCRIPTION from '../subscriptions/deletedMessageSubscription';

const ChatList = ({ authUserId, history }) => {
  const [content, setContent] = useState('activeChats');
  const [search, setSearchState] = useState("");
  const [chatButtonState, setChatButtonState] = useState('activeChats');
  const { loading, error, data, subscribeToMore, refetch, client } = useQuery(GET_ACTIVE_CHATS);
  const [getAllContacts, { loading: contactsLoading, error: contactsError, data: contactsData }] = useLazyQuery(GET_ALL_CONTACTS);
  const [searchContacts, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_CONTACTS);

  const setContentState = (content) => {
    setSearchState(false);
    setContent(content);
    content === 'contactList' && getAllContacts();
    if (content === 'contactList' || content === 'activeChats') {
      setChatButtonState(content)
    }
  }

  const renderChatButton = (chatButtonState) => {
    const chatButton = (chatButtonState === 'activeChats') ? 'contactList': 'activeChats'
    return (
      <NavButton 
        active={content && (content === 'activeChats' || content === 'contactList')}
        toggle={true}
        setContentState={setContentState}
        content={chatButton}
        image={require(`../images/${chatButton}-icon.svg`)}
      />
    );
  }

  // Note: check that error has message property
  if (error || contactsError || searchError) {
    errorHandler((error || contactsError || searchError), client, history);
    return `Error! ${error || contactsError.message || searchError.message}`;
  }
  return (
    <div className='chat-list'>
      <section className='header'>
        <div className='header__title'>
        {
          content === 'activeChats' ?
          'Active Chats':
          content === 'contactList' ?
          'Contact List': 'Your Profile'
        }
        </div>
        <div>
          { renderChatButton(chatButtonState) }
          <NavButton 
            active={content && (content === 'userProfile')}
            toggle={content && (content !== 'userProfile')}
            setContentState={setContentState}
            content='userProfile'
            image={profile__icon}
          />
        </div>
      </section>
      {
        content === 'userProfile' ?  <UserProfile history={history}/> : (
          <div>
            <SearchBox 
              searchContacts={searchContacts}
              setSearchState={setSearchState}/>
            {
              (loading || contactsLoading || searchLoading) ? (
                <div className='u-center'>
                  <Loader />
                </div>
              ) : (search && searchData && searchData.searchContacts.length === 0) ? (
                <div className='search__list--empty'>No contacts were found</div>
              ) : (
                <UserList
                  authUserId={authUserId}
                  data={search ? searchData.searchContacts : 
                    (content === 'activeChats' && data) ? data.getActiveUsers : 
                    content  === 'contactList' ? contactsData.getAllContacts : null}
                    type={search ? 'search' : chatButtonState}
                  subscribeToNewMessages={({ senderId, receiverId}) => 
                    subscribeToMore({
                      document: MESSAGE_SUBSCRIPTION,
                      variables: { senderId, receiverId },
                      updateQuery: (prev, { subscriptionData }) => {
                        refetch();
                      }
                    })
                  }
                  subscribeToDeletedMessages={({ senderId, receiverId}) => 
                    subscribeToMore({
                      document: DELETED_MESSAGE_SUBSCRIPTION,
                      variables: { senderId, receiverId },
                      updateQuery: (prev, { subscriptionData }) => {
                        refetch();
                      }
                    })
                  }
                />
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default ChatList;
