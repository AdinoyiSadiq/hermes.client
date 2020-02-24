import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Picker from 'emoji-picker-react';
import MessageInputModifier from '../../components/messages/MessageInputModifier';
import optimisticResponseMessage from '../../lib/optimisticResponse';
import CREATE_MESSAGE from '../../mutations/createMessage';
import USER_TYPING from '../../mutations/userTyping';
import GET_MESSAGES from '../../queries/getMessages';
import GET_ACTIVE_CHATS  from '../../queries/getActiveChats';

import image__upload__icon from '../../images/image-upload-icon.svg';
import message__send__icon from '../../images/message-send-icon.svg';
import emoji__icon from '../../images/emoji-icon.svg';

// Note: user should not be able to send empty messages, backend and frontend
const MessagingInput = ({ user, authUserId, messageToReply, handleMessageToReply, sendImage }) => {
  const [message, setMessage] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState({});
  const [emoji, setEmoji] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callTypingAPI, setCallTypingAPI] = useState(true);
  const [createMessage, { loading, error, data }] = useMutation(CREATE_MESSAGE);
  const [userTyping] = useMutation(USER_TYPING);

  useEffect(() => {
    clearImage();
    setMessage('');
    handleMessageToReply('');
    setEmoji(false);
    setShowEmojiPicker(false);
  }, [user])

  useEffect(() => {
    if (emoji) {
      const updateMessage = message + emoji
      setMessage(updateMessage);
    }
  }, [emoji])

  const clearImage = () => {
    setImage({});
    setCaption('');
  }

  const onEmojiClick = (event, emojiObject) => {
    event.preventDefault();
    setEmoji(emojiObject.emoji)
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    handleMessageToReply('');
    setEmoji(false);
    setShowEmojiPicker(false);

    if (image.preview) {
      const variables = { text: caption, receiverId: user.id };
      const { file } = image;
      sendImage({ variables, imageFile: file });
      clearImage();
    } else {
      const variables = { text: message, receiverId: user.id };
      messageToReply && (variables.quoteId = messageToReply.id);
      createMessage({ 
        variables,
        optimisticResponse: {
          ...(optimisticResponseMessage(authUserId, user, message, messageToReply))
        },
        update: (cache, { data: { createMessage } }) => {
          const activeUsers = cache.readQuery({ query: GET_ACTIVE_CHATS });
          const updatedActiveUsersList = (activeUsers.getActiveUsers).map((activeUser) => {
            if (activeUser.user.id === user.id) {
              activeUser.lastMessage.text = createMessage.text;
              activeUser.lastMessage.createdAt = createMessage.createdAt;
              activeUser.lastMessage.image = null;
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
      });
    }
  }

  const handleChange = (event, type) => {
    if (type === 'message') {
      setMessage(event.target.value);
    } else if (type === 'caption') {
      setCaption(event.target.value);
    }
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

  const selectImage = (event) => {
    if (event.nativeEvent.target.files && event.nativeEvent.target.files[0]) {
      handleMessageToReply();
      message && setCaption(message);
      const reader = new FileReader();
      const file = event.target.files && event.target.files[0];
      reader.onload = (e) => setImage({ ...image, preview: e.target.result, file });
      reader.readAsDataURL(event.nativeEvent.target.files[0]);
      event.target.value = '';
    }
  }

  return (
    <div>
      {showEmojiPicker && <Picker onEmojiClick={(event, emojiObject) => onEmojiClick(event, emojiObject)} />}
      <form 
        className='message-input'
        onSubmit={event => handleSubmit(event)}>
        <MessageInputModifier 
          messageToReply={messageToReply}
          image={image} 
          handleMessageToReply={handleMessageToReply}
          clearImage={clearImage} />
        {
          image.preview ? (
            <div className='message-input__container--send'>
              <div className='nav-button'>
                <img src={emoji__icon} alt='emoji'/>
              </div>
              <input 
                value={caption}
                onChange={(event) => handleChange(event, 'caption')}
                className='form__input' 
                type='text' 
                placeholder='Add a caption' 
                name='caption' 
                id='caption' 
              />
              <button className='nav-button message-input__send'>
                <img src={message__send__icon} alt='contacts'/>
              </button>
            </div>
          ) : (
            <div className='message-input__container'>
              <div className='nav-button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <img src={emoji__icon} alt='emoji'/>
              </div>
              <input 
                value={message}
                onChange={(event) => handleChange(event, 'message')}
                className='form__input' 
                type='text' 
                placeholder='Type a message' 
                name='message' 
                id='message' 
                autoComplete='off'
              />
              <div className='nav-button__container'>
                <div className='nav-button message-input__image-button'>
                  <input 
                    type='file'
                    id='file'
                    name='file'
                    placeholder='Upload an image'
                    className='message-input__image-picker'
                    accept='image/x-png,image/jpeg'
                    onChange={selectImage}
                  />
                  <img src={image__upload__icon} alt='contacts'/>
                </div>
              </div>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default MessagingInput;
