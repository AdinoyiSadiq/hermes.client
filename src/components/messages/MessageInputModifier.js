import React from 'react';
import reply__icon from '../../images/reply-icon.svg';
import close__icon from '../../images/close-icon.svg';

const MessageInputModifier = ({ messageToReply, image, handleMessageToReply, clearImage }) => {
  const resetInputModifier = () => {
    clearImage();
    handleMessageToReply('');
  }
  return (
    <div>
      {
        messageToReply ? (
          <div className='message-input__reply u-margin-bottom-1'>
            <div className='message-input__reply--container'>
              <div className='message-input__reply--details u-margin-bottom-0.5'>
                <img src={reply__icon} alt='contacts'/>
                <div className='message-input__reply--name'>
                  {`${messageToReply.sender.firstname} ${messageToReply.sender.lastname}`}
                </div>
              </div>
              <div className='message-input__reply--quote'>
                <div>
                  {
                    messageToReply.image && 
                    <img className='message-input__reply--quote-image' src={messageToReply.image} alt="message" />
                  }
                </div>
                <div>{(messageToReply.text) && `${(messageToReply.text).slice(0, 22)}...`}</div>
              </div>
            </div>
            <div 
              className='nav-button message-input__reply--close'
              onClick={() => resetInputModifier()}>
              <img src={close__icon} alt='close reply'/>
            </div>
          </div>
        ) : image.preview ? (
          <div className='message-input__image-preview--container'>
            <div className='message-input__image-preview'>
              <img src={image.preview} alt='preview'/>
            </div>
            <div className='nav-button message-input__image-preview--close'
              onClick={() => resetInputModifier()}>
              <img src={close__icon} alt='close reply'/>
            </div>
          </div>
        ) : <div/>
      }
    </div>
  );
}

export default MessageInputModifier;
