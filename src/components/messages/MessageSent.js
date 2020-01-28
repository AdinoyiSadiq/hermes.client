import React from 'react';
import { timeFormatter } from '../../lib/dateFormatter';
import message__status from '../../images/message-status.svg';

const MessageSent = ({ messageDetails, key }) => {
  return (
    <div className='message__sent'>
    <div>
      <div className='message__content'>
        {messageDetails && messageDetails.text}
      </div>
      <div className='message__details'>
  <div className='message__details--time'>{messageDetails && timeFormatter(messageDetails.createdAt)}</div>
        <div className='message__details--status'>
          <img src={message__status} alt="message status indicator" />
          <img src={message__status} alt="message status indicator" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default MessageSent;