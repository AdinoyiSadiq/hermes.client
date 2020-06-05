import React, { Fragment, useState } from 'react';
import UserImage from '../../components/profile/UserImage';
import EndCallButton from '../../components/buttons/EndCallButton';
import CallButton from '../../components/buttons/CallButton';
import formatText from '../../lib/formatText';

import mic__off__icon from '../../images/mic-off-icon.png'
import video__off__icon from '../../images/vide-off-icon.png'

import mic__on__icon from '../../images/mic-on-icon.png'
import video__on__icon from '../../images/vide-on-icon.png'

const ContactCall = ({ isActiveCall, setActiveCall }) => {
  const { user } = isActiveCall;
  const [videoStatus, setVideoStatus] = useState(false);
  const [micStatus, setMicStatus] = useState(false);

  const toggleVideoStatus = () => {
    setVideoStatus(!videoStatus);
  }

  const toggleMicStatus = () => {
    setMicStatus(!micStatus);
  }

  return (
    <Fragment>
      <div className='contact-call'>
        <UserImage user={user} size='big' />
        <div className='contact-call__username'>
          {formatText(user.firstname)} {formatText(user.lastname)}
        </div>
        <div className='contact-call__status'>
          Calling...
        </div>
      </div>
      <div className='contact-call-button__container'>
        <CallButton 
          image={(videoStatus ? video__on__icon : video__off__icon)}
          buttonClick={toggleVideoStatus}
          disabled={videoStatus}
        />
        <EndCallButton />
        <CallButton 
          image={(micStatus ? mic__on__icon : mic__off__icon)}
          buttonClick={toggleMicStatus}
          disabled={micStatus}
        />
      </div>
    </Fragment>
  );
}

export default ContactCall;
