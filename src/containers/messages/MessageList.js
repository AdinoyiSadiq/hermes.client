import React, { useEffect } from 'react';
import moment from 'moment';
import MessageSent from '../../components/messages/MessageSent';
import MessageReceived from '../../components/messages/MessageReceived';
import Loader from '../../components/loaders/Loader';
import checkDateDifference from '../../lib/checkDateDifference';
import dateFormatter from '../../lib/dateFormatter';

const MessageList = ({ authUserId, messages, loading, subscribeToNewMessages, refresh }) => {
  useEffect(() => {
    subscribeToNewMessages();
  }, []);

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
            messageDetails={message} />
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
            messageDetails={message} />
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
