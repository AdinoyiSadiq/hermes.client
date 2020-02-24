import React, { Fragment } from 'react';
import { timeFormatter } from '../../lib/dateFormatter';
import message__options__icon from '../../images/message-options.svg';
import reply__button__icon from '../../images/reply-button-icon.svg';

const MessageReceived = ({ authUserId, messageDetails, showOptions, setShowOptionsState, handleMessageToReply, messageRefs, handleScrollToMessage }) => {
  const handleReplyMessage = () => {
    handleMessageToReply(messageDetails);
    setShowOptionsState({ messageId: messageDetails.id });
  }

  const handleSetShowOptions = (event) => {
    const showOptionsStateDetails = { messageId: messageDetails.id } 
    if (event.target.getBoundingClientRect().bottom > 620) {
      showOptionsStateDetails['reverse'] = true
    }
    setShowOptionsState({...showOptionsStateDetails})
  }

  const renderMessageOptions = () => {
    return (
      <Fragment>
        {
            showOptions.state && (showOptions.messageId === messageDetails.id) && (
              <ul className={`message__options ${showOptions.reverse && 'message__options--reverse'}`}>
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
    <div className='message__received' ref={el => (messageRefs.current[messageDetails.id] = el)}>
      {messageDetails.image && <img src={messageDetails.image} alt="message"/>}
      {
        (messageDetails && ((messageDetails.image && messageDetails.text) || messageDetails.text)) ? (
          <div>
            <div className='message__content'>
              <div className='message__options--button'
                  onClick={handleSetShowOptions}>
                <img src={message__options__icon} alt='options'/>
              </div>
              <div>
                {
                  (messageDetails.quote.length !== 0) && (
                    <div 
                      className='message__content--quote'
                      onClick={() => {handleScrollToMessage(messageDetails.quote[0])}}>
                      <div>
                        <div className='message__content--quote-name'>
                          {(messageDetails.quote[0].sender.id === authUserId) ? 'You' : `${messageDetails.quote[0].sender.firstname} ${messageDetails.quote[0].sender.lastname}`}
                        </div>
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
                onClick={handleSetShowOptions}>
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