import React, { Fragment } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { timeFormatter } from '../../lib/dateFormatter';
import DELETE_MESSAGE from '../../mutations/deleteMessage';
import GET_MESSAGES from '../../queries/getMessages';
import message__status from '../../images/message-status.svg';
import message__options__icon from '../../images/message-options.svg';
import delete__button__icon from '../../images/delete-button-icon.svg';
import reply__button__icon from '../../images/reply-button-icon.svg';

const MessageSent = ({ 
  messageDetails, showOptions, setShowOptionsState, fetchMoreMessages, handleMessageToReply 
  }) => { 
  const [deleteMessage, { loading, error, data }] = useMutation(DELETE_MESSAGE);

  const handleDeleteMessage = () => {
    deleteMessage({
      variables: { messageId: messageDetails.id },
      update: (cache, { data: { deleteMessage } }) => {
        const data = cache.readQuery({ 
          query: GET_MESSAGES,
          variables: { receiverId: deleteMessage.receiver.id },
        });

        cache.writeQuery({
          query: GET_MESSAGES, 
          variables: { receiverId: deleteMessage.receiver.id },
          data: { getMessages: data.getMessages.filter(message => message.id !== messageDetails.id) }
        });
        fetchMoreMessages(3);
      }
    });
    setShowOptionsState({ messageId: messageDetails.id });
  }

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
              <li className='message__option'
                  onClick={handleDeleteMessage}>
                <img src={delete__button__icon} alt='delete'/>
                <div>Delete</div>
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
        <div className='message__details--status'>
          <img src={message__status} alt="message status indicator" />
          <img src={message__status} alt="message status indicator" />
        </div>
      </div>
    );
  }

  return (
      <div className='message__sent'>
        {messageDetails.image && <img src={messageDetails.image} alt="message"/>}
        {
          (messageDetails && ((messageDetails.image && messageDetails.text) || messageDetails.text)) ? (
            <div>
              <div className={`message__content ${loading ? 'message__content--loading' : ''}`}>
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
                  <div className='message__content--text'>
                    {messageDetails && messageDetails.text}
                  </div>
                </div>
                <div className={`message__options--button ${showOptions.state && (showOptions.messageId === messageDetails.id) ? `message__options--button-show` : ``}`}
                    onClick={() => setShowOptionsState({ messageId: messageDetails.id })}>
                  <img src={message__options__icon} alt='options'/>
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

export default MessageSent;