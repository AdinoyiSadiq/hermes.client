import React from 'react';
import moment from 'moment';
import MessageSent from '../../components/messages/MessageSent';
import MessageReceived from '../../components/messages/MessageReceived';
import Loader from '../../components/loaders/Loader';
import checkDateDifference from '../../lib/checkDateDifference';
import dateFormatter from '../../lib/dateFormatter';

const MessageList = ({ authUserId, messages, loading }) => {
  const renderMessageList = (authUserId, messages) => {
    const messageDate = { dataString: moment().format('YYYY-MM-DD HH:mm:ss') };
    const messageList = [...messages].reverse().map(message => {
      const showDate = checkDateDifference(messageDate.dataString, message.createdAt);
      if (showDate) { messageDate['dataString'] = message.createdAt }
      if ((message && message.sender && message.sender.id) === authUserId) {
        return (
          <div>
            {
              showDate && (
                <div className='messages__date--container'>
                  <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
                </div>
              )
            }
            <MessageSent 
              key={message.id} 
              messageDetails={message} />
          </div>
        );
      } else {
        return (
          <div>
            {
              showDate && (
                <div className='messages__date--container'>
                  <div className='messages__date'>{dateFormatter(message.createdAt, 'messages')}</div>
                </div>
              )
            }
            <MessageReceived 
              key={message.id} 
              messageDetails={message} />
          </div>
        );
      }
    });
    return messageList;
  }
  return (
    <div>
      {loading && (
        <div className={`u-center${messages ? '-top' : ''} u-margin-bottom-2 u-margin-top-2`}>
          <Loader size='medium-invert' />
        </div>
      )}
      {(authUserId && messages) && renderMessageList(authUserId, messages)}
    </div>
  );
}

export default MessageList;
