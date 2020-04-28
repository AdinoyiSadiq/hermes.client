import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import NavButton from '../components/buttons/NavButton';
import UserListWrapper from './user/UserListWrapper';
import UserProfile from './user/UserProfile';

import profile__icon from '../images/profile-icon.svg';

import GET_ALL_CONTACTS from '../queries/getAllContacts';
import GET_SENT_CONTACT_REQUESTS from '../queries/getSentContactRequests';
import GET_RECEIVED_CONTACT_REQUESTS from '../queries/getReceivedContactRequests';
import GET_REJECTED_CONTACT_REQUESTS from '../queries/getRejectedContactRequests';

const ChatList = ({ authUserId, history }) => {
  const [content, setContent] = useState('activeChats');
  const [search, setSearchState] = useState("");
  const [chatButtonState, setChatButtonState] = useState('activeChats');
  const [getAllContacts, contactsResults] = useLazyQuery(GET_ALL_CONTACTS);
  const [getSentContactRequests, contactSentRequestResults] = useLazyQuery(GET_SENT_CONTACT_REQUESTS);
  const [getReceivedContactRequests, contactReceivedRequestResults] = useLazyQuery(GET_RECEIVED_CONTACT_REQUESTS);
  const [getRejectedContactRequests, contactRejectedRequestResults] = useLazyQuery(GET_REJECTED_CONTACT_REQUESTS);

  const setContentState = (content) => {
    setSearchState(false);
    setContent(content);
    if (content === 'contactList') {
      getAllContacts();
      getSentContactRequests();
      getReceivedContactRequests();
      getRejectedContactRequests();
    }
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
        content === 'userProfile' ?  <UserProfile history={history}/> : 
        <UserListWrapper 
          authUserId={authUserId}
          content={content}
          search={search}
          chatButtonState={chatButtonState}
          setSearchState={setSearchState}
          contactsResults={contactsResults}
          contactSentRequestResults={contactSentRequestResults}
          contactReceivedRequestResults={contactReceivedRequestResults}
          contactRejectedRequestResults={contactRejectedRequestResults}
          history={history}
        />
      }
    </div>
  );
}

export default ChatList;
