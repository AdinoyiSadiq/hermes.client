import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MessageList from './messages/MessageList';
import MessageInput from './messages/MessageInput';
import MessageHeader from './messages/MessageHeader';
import errorHandler from '../lib/errorHandler';
import GET_MESSAGES from '../queries/getMessages';
import UPDATE_MESSAGE from '../mutations/updateMessage';
import MESSAGE_SUBSCRIPTION from '../subscriptions/messageSubscription';
import DELETED_MESSAGE_SUBSCRIPTION from '../subscriptions/deletedMessageSubscription';
import UPDATED_MESSAGE_SUBSCRIPTION from '../subscriptions/updatedMessageSubscription';
import GET_ACTIVE_CHATS  from '../queries/getActiveChats';

const Messaging = ({ user, authUserId, setShowContact, sendImage, uploadingImage, setActiveCall, history }) => {
  const prevMessageSub = useRef();
  const prevDeleteMessageSub = useRef();
  const prevUpdateMessageSub = useRef();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messageToReply, setMessageToReply] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [updateMessages] = useMutation(UPDATE_MESSAGE);
  const { loading: messagesLoading, error: messagesError, data: messagesData, fetchMore, subscribeToMore, client } = useQuery(GET_MESSAGES, { 
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
    if (messagesData && messagesData.getMessages) {
      const messageIds = []
      messagesData.getMessages.forEach(message => {
        if ((message.sender.id !== authUserId) && (message.state !== 'delivered')) {
          messageIds.push(message.id);
        }
      });

      if (messageIds.length) {
          updateMessages({ 
            variables: { state: 'delivered', messageIds: messageIds },
            update: (cache) => {
              const activeUsers = cache.readQuery({ query: GET_ACTIVE_CHATS });
              const updatedActiveUsers = activeUsers && activeUsers.getActiveUsers && 
                                      (activeUsers.getActiveUsers).map((activeUser) => {
                                        if (activeUser.user.id === user.id) activeUser.unreadMessages = 0;
                                        return activeUser
                                      });
              cache.writeQuery({
                query: GET_ACTIVE_CHATS, 
                data: { getActiveUsers: [...updatedActiveUsers] }
              });
            },
          });
      }
    }
  }, [messagesData])

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
    if (prevMessageSub.current) {
      prevMessageSub.current();
    }
    prevMessageSub.current = subscribeToMore({
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
    if (prevDeleteMessageSub.current) {
      prevDeleteMessageSub.current();
    }
    prevDeleteMessageSub.current = subscribeToMore({
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

  const subscribeToUpdatedMessages = () => {
    if (prevUpdateMessageSub.current) {
      prevUpdateMessageSub.current();
    }
    prevUpdateMessageSub.current = subscribeToMore({
      document: UPDATED_MESSAGE_SUBSCRIPTION,
      variables: { 
        senderId: authUserId,
        receiverId: user.id
      },
    });
  }

  const setScrollPosition = () => {
    const messagesComponent = document.getElementsByClassName('messages')[0];       
    const scrollHeight = messagesComponent.scrollHeight;
    setTimeout(() => {
      messagesComponent.scrollTop = messagesComponent.scrollHeight - scrollHeight
    }, 100);
  }

  const fetchMoreMessages = (limit) => {
    fetchMore({
      variables: {
        receiverId: user.id,
        cursor: messagesData.getMessages[messagesData.getMessages.length - 1].createdAt,
        limit: limit || 15,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.getMessages.length < (limit || 15)) {
          setHasMoreMessages(false);
        }
        const updatedMessages = [...prev.getMessages, ...fetchMoreResult.getMessages]
        return {
          ...prev,
          getMessages: updatedMessages
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

  if (messagesError) {
    errorHandler(messagesError, client, history);
  }

  return (
    <div className='messaging'>
      <MessageHeader 
        user={user} 
        authUserId={authUserId}
        setShowContact={setShowContact}
        uploadingImage={uploadingImage}
        setActiveCall={setActiveCall}
      />
      <MessageList 
        refresh={refresh}
        userId={user.id}
        authUserId={authUserId} 
        messages={messagesData && messagesData.getMessages} 
        loading={messagesLoading} 
        subscribeToNewMessages={subscribeToNewMessages}
        subscribeToDeletedMessages={subscribeToDeletedMessages}
        subscribeToUpdatedMessages={subscribeToUpdatedMessages}
        fetchMoreMessages={fetchMoreMessages}
        handleMessageToReply={handleMessageToReply}
        history={history}
      />
      <MessageInput 
        user={user}
        authUserId={authUserId} 
        messageToReply={messageToReply} 
        handleMessageToReply={handleMessageToReply}
        sendImage={sendImage}
        history={history}
        />
    </div>
  );
}

export default Messaging;