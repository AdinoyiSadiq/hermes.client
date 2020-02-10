import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import MessageList from './messages/MessageList';
import MessageInput from './messages/MessageInput';
import MessageHeader from './messages/MessageHeader';
import GET_MESSAGES from '../queries/getMessages';
import MESSAGE_SUBSCRIPTION from '../subscriptions/messageSubscription';
import DELETED_MESSAGE_SUBSCRIPTION from '../subscriptions/deletedMessageSubscription';

const Messaging = ({ user, authUserId, setShowContact, sendImage }) => {
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messageToReply, setMessageToReply] = useState('');
  const [refresh, setRefresh] = useState(false);
  const { loading: messagesLoading, error: messagesError, data: messagesData, fetchMore, subscribeToMore } = useQuery(GET_MESSAGES, { 
    variables: { receiverId: user.id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    setHasMoreMessages(true);
    setRefresh(true);
    setTimeout(() => { setRefresh(false) }, 100);
  }, [user.id]);

  useEffect(() => {
    const messagesComponent = document.getElementsByClassName('messages')[0];
    if (messagesComponent) {
      messagesComponent.addEventListener("scroll", handleScroll, false);
    
      return () => {
        messagesComponent.removeEventListener("scroll", handleScroll, false);
      };
    }
  });

  const subscribeToNewMessages = () => {
    subscribeToMore && subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { 
        senderId: user.id,
        receiverId: authUserId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const message = subscriptionData.data.message;
        return {
          ...prev,
          getMessages: [message, ...prev.getMessages]
        }
      }
    });
  }

  const subscribeToDeletedMessages = () => {
    // Create a subscription that only works one way specifically for the messaging section, 
    // leave the active chats as is
    subscribeToMore && subscribeToMore({
      document: DELETED_MESSAGE_SUBSCRIPTION,
      variables: { 
        senderId: user.id,
        receiverId: authUserId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedMessage = subscriptionData.data.deletedMessage;
        return {
          ...prev,
          getMessages:  prev.getMessages.filter(message => message.id !== deletedMessage.id)
        }
      }
    });
  }

  const setScrollPosition = (reset) => {
    const messagesComponent = document.getElementsByClassName('messages')[0];       
    const scrollHeight = messagesComponent.scrollHeight;
    setTimeout(() => {
      messagesComponent.scrollTop = messagesComponent.scrollHeight - scrollHeight
    }, 100);
  }

  const fetchMoreMessages = (limit) => {
    // Note: refactor offset pagination
    fetchMore({
      variables: {
        receiverId: user.id,
        offset: messagesData.getMessages.length,
        limit: limit || 15,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.getMessages.length < (limit || 15)) {
          setHasMoreMessages(false);
        }
        return {
          ...prev,
          getMessages: [...prev.getMessages, ...fetchMoreResult.getMessages]
        }
      }
    });
  }

  const handleScroll = (e) => {
    if(!messagesLoading && hasMoreMessages && (e && e.target && e.target.scrollTop === 0)) {
      if (messagesData && messagesData.getMessages) {
        fetchMoreMessages();
        setScrollPosition();
      }
    }
  }

  const handleMessageToReply = (message) => {
    setMessageToReply(message);
  }

  
  return (
    <div className='messaging'>
      <MessageHeader 
        user={user} 
        authUserId={authUserId}
        setShowContact={setShowContact}
      />
      <MessageList 
        refresh={refresh}
        authUserId={authUserId} 
        messages={messagesData && messagesData.getMessages} 
        loading={messagesLoading} 
        subscribeToNewMessages={subscribeToNewMessages}
        subscribeToDeletedMessages={subscribeToDeletedMessages}
        fetchMoreMessages={fetchMoreMessages}
        handleMessageToReply={handleMessageToReply}
      />
      <MessageInput 
        user={user}
        authUserId={authUserId} 
        messageToReply={messageToReply} 
        handleMessageToReply={handleMessageToReply}
        sendImage={sendImage}
        />
    </div>
  );
}

export default Messaging;