import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/react-hooks';

import SearchBox from '../components/search/SearchBox';
import NavButton from '../components/buttons/NavButton';
import UserList from './user/UserList';
import UserProfile from './user/UserProfile';

import profile__icon from '../images/profile-icon.svg';

import GET_ALL_CONTACTS from '../queries/getAllContacts';
import GET_ACTIVE_CHATS from '../queries/getActiveChats';
import SEARCH_CONTACTS from '../queries/searchContacts';



const ChatList = () => {
  const [content, setContent] = useState('activeChats');
  const [search, setSearchState] = useState("")
  const [chatButtonState, setChatButtonState] = useState('activeChats');
  const { loading, error, data } = useQuery(GET_ACTIVE_CHATS);
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
        setContentState={setContentState}
        content={chatButton}
        image={require(`../images/${chatButton}-icon.svg`)}
      />
    );
  }

  // Note: check that error has message property
  if (error || contactsError || searchError) return `Error! ${error || contactsError.message || searchError.message}`;
  console.log('values', data && data, contactsData && contactsData);
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
            setContentState={setContentState}
            content='userProfile'
            image={profile__icon}
          />
        </div>
      </section>
      {
        content === 'userProfile' ?  <UserProfile /> : (
          <div>
            <SearchBox 
              searchContacts={searchContacts}
              setSearchState={setSearchState}/>
            {
              (loading || contactsLoading || searchLoading) ? 'Loading...' : (
                <UserList
                  data={search ? searchData.searchContacts : content === 'activeChats' ? data.getActiveUsers : content  === 'contactList' ? contactsData.getAllContacts : null}
                  type={search ? 'search' : chatButtonState}
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
