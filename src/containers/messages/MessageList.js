import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import MessageSent from '../../components/messages/MessageSent';
import MessageReceived from '../../components/messages/MessageReceived';
import Loader from '../../components/loaders/Loader';
import checkDateDifference from '../../lib/checkDateDifference';
import dateFormatter from '../../lib/dateFormatter';

const MessageList = ({ 
  userId, authUserId, messages, loading, subscribeToNewMessages, subscribeToDeletedMessages, subscribeToUpdatedMessages, fetchMoreMessages, handleMessageToReply, refresh 
  }) => {
  const messageTimeRef = useRef();
  const messageRefs = useRef([]);
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    subscribeToNewMessages();
    subscribeToDeletedMessages();
    subscribeToUpdatedMessages();
  }, [userId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.01, 0.98, 0.99, 1]
    }
    const observer = new IntersectionObserver(onChange, options);
    let messages = [...document.getElementsByClassName('message')];
    messages.length > 0 && messages.forEach(message => observer.observe(message));
  })

  function onChange(changes, observer) {
    changes.forEach(change => {
      if (change.intersectionRatio > 0 && change.boundingClientRect.top < 90) {
        (messageTimeRef.current && !loading) && (messageTimeRef.current.innerHTML = dateFormatter(parseInt(change.target.id) , 'messages')); 
      }
  });
}

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

  const setShowOptionsState = ({ messageId, reverse }) => {
    setShowOptions({ state: !showOptions.state, messageId, reverse });
  }

  const handleScrollToMessage = (messageId) => {
    console.log(messageRefs.current[messageId]);
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({ block: 'end' });
    }
  }

  const renderMessage = ({ message, showDate }) => {
    if ((message && message.sender && message.sender.id) === authUserId) {
      return (
        <div className='message' key={message.id} id={message.createdAt}>
          {
            showDate && (
              <div className='messages__date--container'>
                <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
              </div>
            )
          }
          <MessageSent
            authUserId={authUserId}
            messageDetails={message}
            showOptions={showOptions}
            setShowOptionsState={setShowOptionsState}
            fetchMoreMessages={fetchMoreMessages}
            handleMessageToReply={handleMessageToReply}
            messageRefs={messageRefs}
            handleScrollToMessage={handleScrollToMessage} />
        </div>
      );
    } else {
      return (
        <div className='message' key={message.id} id={message.createdAt}>
          {
            showDate && (
              <div className='messages__date--container'>
                <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
              </div>
            )
          }
          <MessageReceived 
            authUserId={authUserId}
            messageDetails={message}
            showOptions={showOptions}
            setShowOptionsState={setShowOptionsState}
            handleMessageToReply={handleMessageToReply}
            messageRefs={messageRefs}
            handleScrollToMessage={handleScrollToMessage} />
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
      <div className='messages__date--container messages__date--container-persistent'>
        <div className='messages__date' ref={messageTimeRef} />
      </div>
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
