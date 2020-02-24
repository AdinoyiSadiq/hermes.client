import React, { useState } from 'react';
import { useSubscription } from "@apollo/react-hooks";
import UserImage from '../../components/profile/UserImage';
import TYPING_SUBSCRIPTION from '../../subscriptions/typingSubscription';
import search__icon__orange from '../../images/search-icon--orange.svg';

const MessageHeader = ({ user, authUserId, setShowContact, uploadingImage }) => {
  const [isTyping, setIsTyping] = useState({ state: false, user: false });
  useSubscription(
    TYPING_SUBSCRIPTION,
    { 
      variables: { senderId: user.id, receiverId: authUserId },
      onSubscriptionData: (res) => {
        if (res.subscriptionData.data) {
          setTypingState();
        }
      }
    }
  );

  const setTypingState = () => {
    setIsTyping({ state: true, user: user.id });
    setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }

  return (
    <section>
      <div className='header'>
        <div className='user__details' onClick={() => setShowContact(true)}>
          <UserImage user={user} size='small'/>
          <div className='user__details--name'>
            <div>{`${user.firstname} ${user.lastname}`}</div>
            <div className='user__details--subtext'>{(isTyping.state && isTyping.user === user.id) ? 'typing...' : ''}</div>
          </div>
        </div>
        <div className='nav-button u-hide'>
          <img src={search__icon__orange} alt='search'/>
        </div>
      </div>
      {(uploadingImage.state && uploadingImage.receiverId === user.id) && (
        <div class="loader-bar" />
      )}
    </section>
  );
}

export default MessageHeader;
