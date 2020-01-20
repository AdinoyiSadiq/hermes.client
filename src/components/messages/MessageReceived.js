import React from 'react';
import { timeFormatter } from '../../lib/dateFormatter';

const MessageReceived = ({ messageDetails }) => {
  return (
    <div className='message__received'>
      <div>
        <div className='message__content'>
          {messageDetails && messageDetails.text}
        </div>
        <div className='message__details'>
          <div className='message__details--time'>{messageDetails && timeFormatter(messageDetails.createdAt)}</div>
        </div>
      </div>
    </div>
  )
}

export default MessageReceived;