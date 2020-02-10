import React, { Fragment } from 'react';
import { timeFormatter } from '../../lib/dateFormatter';
import message__options__icon from '../../images/message-options.svg';
import reply__button__icon from '../../images/reply-button-icon.svg';

const MessageReceived = ({ messageDetails, showOptions, setShowOptionsState, handleMessageToReply }) => {
  const handleReplyMessage = () => {
    handleMessageToReply(messageDetails);
    setShowOptionsState({ messageId: messageDetails.id });
  }

  const renderMessageOptions = () => {
    return (
      <Fragment>
        {
            showOptions.state && (showOptions.messageId === messageDetails.id) && (
              <ul className='message__options'>
                <li className='message__option'
                    onClick={handleReplyMessage}>
                  <img src={reply__button__icon} alt='delete'/>
                  <div>Reply</div>
                </li>
              </ul>)
          }
      </Fragment>
    );
  }

  const renderMessageDetails = () => {
    return (
      <div className='message__details'>
        <div className='message__details--time'>{messageDetails && timeFormatter(messageDetails.createdAt)}</div>
      </div>
    );
  }

  return (
    <div className='message__received'>
      {messageDetails.image && <img src={messageDetails.image} alt="message"/>}
      {
        (messageDetails && ((messageDetails.image && messageDetails.text) || messageDetails.text)) ? (
          <div>
            <div className='message__content'>
              <div className='message__options--button'
                  onClick={() => setShowOptionsState({ messageId: messageDetails.id })}>
                <img src={message__options__icon} alt='options'/>
              </div>
              <div>
                {
                  (messageDetails.quote.length !== 0) && (
                    <div className='message__content--quote'>
                      <div>
                        <div className='message__content--quote-name'>{`${messageDetails.quote[0].sender.firstname} ${messageDetails.quote[0].sender.lastname}`}</div>
                        <div className='message__content--quote-message'>{messageDetails.quote[0].text}</div>
                      </div>
                      <div>
                        {
                          messageDetails.quote[0].image && 
                          <img className='message__content--quote-image' src={messageDetails.quote[0].image} alt="message" />
                        }
                      </div>
                    </div>
                  )
                }
                <div>
                  {messageDetails && messageDetails.text}
                </div>         
              </div>
            </div>
            {renderMessageOptions()}
            {renderMessageDetails()}
          </div>
        ) : (
          <Fragment>
            <div className={`message__options--button message__options--button-image ${showOptions.state && (showOptions.messageId === messageDetails.id) ? `message__options--button-show` : ``}`}
                onClick={() => setShowOptionsState({ messageId: messageDetails.id })}>
              <img src={message__options__icon} alt='options'/>
            </div>
            {renderMessageOptions()}
            {renderMessageDetails()}
          </Fragment>
        )
      }
    </div>
  )
}

export default MessageReceived;