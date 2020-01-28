import React, { useEffect, useState } from 'react';
import { useSubscription } from "@apollo/react-hooks";
import UserImage from '../../components/profile/UserImage';
import TYPING_SUBSCRIPTION from '../../subscriptions/typingSubscription';
import search__icon__orange from '../../images/search-icon--orange.svg';

const MessageHeader = ({ user, authUserId }) => {
  const [isTyping, setIsTyping] = useState(false);
  const { data } = useSubscription(
    TYPING_SUBSCRIPTION,
    { variables: { senderId: user.id, receiverId: authUserId} }
  );

  useEffect(() => {
    if (data) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  }, [data]);

  return (
    <section className='header'>
      <div className='user__details'>
        <UserImage user={user} size='small'/>
        <div className='user__details--name'>
          <div>{`${user.firstname} ${user.lastname}`}</div>
          <div className='user__details--subtext'>{isTyping ? 'typing...' : ''}</div>
        </div>
      </div>
      <div className='nav-button'>
        <img src={search__icon__orange} alt='search'/>
      </div>
    </section>
  );
}

export default MessageHeader;
