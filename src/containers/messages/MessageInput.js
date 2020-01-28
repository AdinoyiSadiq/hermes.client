import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import CREATE_MESSAGE from '../../mutations/createMessage';
import USER_TYPING from '../../mutations/userTyping';
import GET_MESSAGES from '../../queries/getMessages';
import GET_ACTIVE_CHATS  from '../../queries/getActiveChats';
import image__upload__icon from '../../images/image-upload-icon.svg';
import emoji__icon from '../../images/emoji-icon.svg';

const MessagingInput = ({ user, authUserId }) => {
  const [message, setMessage] = useState('');
  const [callTypingAPI, setCallTypingAPI] = useState(true);
  const [createMessage, { loading, error, data }] = useMutation(CREATE_MESSAGE);
  const [userTyping] = useMutation(USER_TYPING);

  const optimisticResponseMessage = () => {
    return {
      __typename: 'Mutation',
      createMessage: {
        __typename: 'Message',
        id: Math.floor(Math.random() * 1000000000),
        text: message,
        createdAt: Date.now(),
        quote: [],
        sender: {
          __typename: 'User',
          id: authUserId,
        },
        receiver: {
          __typename: 'User',
          id: user.id
        }
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    createMessage({ 
      variables: {
        text: message,
        receiverId: user.id,
      },
      optimisticResponse: {
        ...(optimisticResponseMessage())
      },
      update: (cache, { data: { createMessage } }) => {
        const activeUsers = cache.readQuery({ query: GET_ACTIVE_CHATS });
        
        const updatedActiveUsersList = (activeUsers.getActiveUsers).map((activeUser) => {
          if (activeUser.user.id === user.id) {
            activeUser.lastMessage.text = createMessage.text;
            activeUser.lastMessage.createdAt = createMessage.createdAt;
          }
          return activeUser;
        });
        const data = cache.readQuery({ 
          query: GET_MESSAGES,
          variables: {
            receiverId: user.id,
          },
        });
        cache.writeQuery({ 
          query: GET_MESSAGES, 
          variables: { receiverId: user.id },
          data: { getMessages: [createMessage, ...data.getMessages] }
        });
        cache.writeQuery({
          query: GET_ACTIVE_CHATS, 
          data: { getActiveUsers: [...updatedActiveUsersList] }
        });
      }
    })
  }

  const handleChange = (event) => {
    setMessage(event.target.value);
    if (!callTypingAPI) return;
    userTyping({
      variables: {
        senderId: authUserId,
        receiverId: user.id,
      }
    });
    setCallTypingAPI(false);
    setTimeout(() => {
      setCallTypingAPI(true);
    }, 5000);
  }

  return (
    <form 
      className='message-input'
      onSubmit={event => {
        handleSubmit(event);
      }}>
      <div className='message-input__container'>
        <div className='nav-button'>
          <img src={emoji__icon} alt='contacts'/>
        </div>
        <input 
          value={message}
          onChange={handleChange}
          className='form__input' 
          type='text' 
          placeholder='Type a message' 
          name='message' 
          id='message' 
        />
        <div className='nav-button__container'>
          <div className='nav-button'>
            <img src={image__upload__icon} alt='contacts'/>
          </div>
        </div>
      </div>
    </form>
  );
}

export default MessagingInput;
