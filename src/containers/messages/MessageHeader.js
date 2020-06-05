import React, { useState } from 'react';
import { useSubscription } from "@apollo/react-hooks";
import UserImage from '../../components/profile/UserImage';
import formatText from '../../lib/formatText';
import TYPING_SUBSCRIPTION from '../../subscriptions/typingSubscription';
import audio__icon from '../../images/audio-icon.svg';
import video__icon from '../../images/video-icon.svg';

const MessageHeader = ({ user, authUserId, setShowContact, uploadingImage, setActiveCall }) => {
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

  const startCall = (type) => {
    setActiveCall({ user, type, direction: 'out' })
  }

  return (
    <section>
      <div className='header'>
        <div className='user__details' onClick={() => setShowContact(true)}>
          <UserImage user={user} size='small'/>
          <div className='user__details--name'>
            <div>{`${formatText(user.firstname)} ${formatText(user.lastname)}`}</div>
            <div className='user__details--subtext'>{(isTyping.state && isTyping.user === user.id) ? 'typing...' : ''}</div>
          </div>
        </div>
        <div className='call-button__container'>
          <div 
            className='nav-button call-button'
            onClick={() => startCall('audio')}
          >
            <img src={audio__icon} alt='search'/>
          </div>
          <div 
            className='nav-button call-button'
            onClick={() => startCall('video')}
          >
            <img src={video__icon} alt='search'/>
          </div>
        </div>
      </div>
      {(uploadingImage.state && uploadingImage.receiverId === user.id) && (
        <div className="loader-bar" />
      )}
      
    </section>
  );
}

export default MessageHeader;
