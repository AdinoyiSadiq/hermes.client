import React from 'react';
import UserImage from '../../components/profile/UserImage';
import EndCallButton from '../../components/buttons/EndCallButton';
import AcceptCallButton from '../../components/buttons/AcceptCallButton';
import formatText from '../../lib/formatText';
import close__icon from '../../images/close-icon.svg';

const ContactCallRequest = ({  callRequest, setCallRequest, setActiveCall }) => {
  const { user, type } = callRequest;
  const declineCallRequest = () => {
    // add decline call mutation
    setCallRequest({});
  }

  const acceptCallRequest = () => {
    setCallRequest({});
    setActiveCall({
      user: callRequest.user,
      type: callRequest.type,
      iceCandidate: callRequest.iceCandidate,
      offer: callRequest.offer,
      direction: 'in',
    });
  }

  return (
    <div className='contact-call-request'>
      <div className='nav-button contact-call-request__close-button'>
        <img src={close__icon} alt='decline call request'/>
      </div>
      <div className='contact-call-request__title'>{`Incoming ${type} call`}</div>
      <div>
        <div className='contact-call-request__user--image'>
          <UserImage 
            user={user}
            size='medium'
          />
        </div>
        <div className='contact-call-request__user--name'>
          {`${formatText(user.firstname)} ${formatText(user.lastname)}`}
        </div>
      </div>
      <div className='contact-call-request__button--container'>
        <EndCallButton 
          buttonClick={declineCallRequest}
        />
        <AcceptCallButton 
          buttonClick={acceptCallRequest}
        />
      </div>
    </div>
  );
}

export default ContactCallRequest;
