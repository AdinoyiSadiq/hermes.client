import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import UserImage from '../components/profile/UserImage';
import MessageList from './messages/MessageList';
import GET_MESSAGES from '../queries/getMessages';
import GET_AUTH_USER from '../queries/getAuthUser';
import search__icon__orange from '../images/search-icon--orange.svg';
import image__upload__icon from '../images/image-upload-icon.svg';
import emoji__icon from '../images/emoji-icon.svg';

const Messaging = ({ user }) => {
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const { loading: authUserLoading, error: authUserError, data: authUserData } = useQuery(GET_AUTH_USER);
  const { loading: messagesLoading, error: messagesError, data: messagesData, fetchMore } = useQuery(GET_MESSAGES, { 
    variables: { receiverId: user.id },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const element = document.getElementsByClassName('messages')[0]
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  },[]);

  useEffect(() => {
    const messagesComponent = document.getElementsByClassName('messages')[0];
    messagesComponent.addEventListener("scroll", handleScroll, false);
    
    return () => {
      messagesComponent.removeEventListener("scroll", handleScroll, false);
    };
  });

  const setScrollPosition = () => {
    const messagesComponent = document.getElementsByClassName('messages')[0];       
    const scrollHeight = messagesComponent.scrollHeight;
    setTimeout(() => {
      messagesComponent.scrollTop = messagesComponent.scrollHeight - scrollHeight
    }, 50);
  }

  const handleScroll = (e) => {
    if(hasMoreMessages && (e && e.target && e.target.scrollTop === 0)) {
      fetchMore({
        variables: {
          receiverId: user.id,
          offset: messagesData.getMessages.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (fetchMoreResult.getMessages.length < 15) {
            setHasMoreMessages(false);
          }
          return {
            ...prev,
            getMessages: [...prev.getMessages, ...fetchMoreResult.getMessages]
          }
        }
      });
      setScrollPosition();
    }
  }
  
  return (
    <div className='messaging'>
      <section className='header'>
        <div className='user__details'>
          <UserImage user={user} size='small'/>
          <div className='user__details--name'>{`${user.firstname} ${user.lastname}`}</div>
        </div>
        <div className='nav-button'>
          <img src={search__icon__orange} alt='search'/>
        </div>
      </section>

      <section className='messages'>
        <MessageList 
          authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id} 
          messages={messagesData && messagesData.getMessages} 
          loading={authUserLoading || messagesLoading}
        />
      </section>
      
      <section className='message-input'>
        <div className='message-input__container'>
          <div className='nav-button'>
            <img src={emoji__icon} alt='contacts'/>
          </div>
          <input className='form__input' type='text' placeholder='Type a message' name='message' id='message' />
          <div className='nav-button__container'>
            <div className='nav-button'>
              <img src={image__upload__icon} alt='contacts'/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Messaging;