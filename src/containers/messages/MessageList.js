import React, { useEffect, useState } from 'react';
import moment from 'moment';
import MessageSent from '../../components/messages/MessageSent';
import MessageReceived from '../../components/messages/MessageReceived';
import Loader from '../../components/loaders/Loader';
import checkDateDifference from '../../lib/checkDateDifference';
import dateFormatter from '../../lib/dateFormatter';

const MessageList = ({ 
  authUserId, messages, loading, subscribeToNewMessages, subscribeToDeletedMessages, fetchMoreMessages, handleMessageToReply, refresh 
  }) => {
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    subscribeToNewMessages();
    subscribeToDeletedMessages();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = (event) => {
    const { target } = event;
    const targetClassButton = 'message__options--button';
    const targetClassButtonShow = 'message__options--button message__options--button-show';
    const targetClassButtonImage = 'message__options--button message__options--button-image';
    const targetClassButtonImageShow = 'message__options--button message__options--button-image message__options--button-show';
    const targetClassOption = 'message__option';
    if (
      target.className !== targetClassButton  && 
      target.parentNode.className !== targetClassButton &&
      target.parentNode.className !== targetClassOption &&
      target.parentNode.className !== targetClassButtonImage &&
      target.parentNode.className !== targetClassButtonImageShow &&
      target.parentNode.className !== targetClassButtonShow &&
      target.className !== targetClassOption
      ) {
      setShowOptions(false);
    }
  }

  const setShowOptionsState = ({ messageId }) => {
    setShowOptions({ state: !showOptions.state, messageId });
  }

  const renderMessage = ({ message, showDate }) => {
    if ((message && message.sender && message.sender.id) === authUserId) {
      return (
        <div key={message.id}>
          {
            showDate && (
              <div className='messages__date--container'>
                <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
              </div>
            )
          }
          <MessageSent
            messageDetails={message}
            showOptions={showOptions}
            setShowOptionsState={setShowOptionsState}
            fetchMoreMessages={fetchMoreMessages}
            handleMessageToReply={handleMessageToReply} />
        </div>
      );
    } else {
      return (
        <div key={message.id}>
          {
            showDate && (
              <div className='messages__date--container'>
                <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
              </div>
            )
          }
          <MessageReceived 
            messageDetails={message}
            showOptions={showOptions}
            setShowOptionsState={setShowOptionsState}
            handleMessageToReply={handleMessageToReply} />
        </div>
      );
    }
  }

  const renderMessageList = (authUserId, messages) => {
    const messageDate = { dataString: moment().format('YYYY-MM-DD HH:mm:ss') };
    const messageList = [...messages].reverse().map(message => {
      const showDate = checkDateDifference(messageDate.dataString, message.createdAt);
      if (showDate) { messageDate['dataString'] = message.createdAt }
      return renderMessage({ message, showDate });
    });
    return messageList.reverse();
  }

  return (
    <section className='messages'>
      {(!refresh && authUserId && messages) && renderMessageList(authUserId, messages)}
      {loading && (
        <div>
          <div className='u-center-top u-margin-bottom-2 u-margin-top-2'>
            <Loader size='medium-invert' />
          </div>
        </div>
      )}
    </section>
  );
}

export default MessageList;
