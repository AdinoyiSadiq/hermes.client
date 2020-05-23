import React from 'react';
import default__message__icon from '../images/default-message.svg';

const DefaultMessage = ({ user, authUserId, updateUser }) => {
  return (
    <div className='default-message'>
      <div className='default-message__image--container'>
        <img src={default__message__icon} alt='default message'/>
      </div>  

      <div className='default-message__primary'>Your messages live  here</div>
      <div className='default-message__secondary'>Enjoy the Hermes way</div>
    </div>
  );
}

export default DefaultMessage;
