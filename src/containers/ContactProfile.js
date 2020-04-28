import React, { Fragment } from 'react';
import UserImage from '../components/profile/UserImage';
import Loader from '../components/loaders/Loader';
import formatText from '../lib/formatText';
import close__icon from '../images/close-icon.svg';

const ContactProfile = ({ user, loading, contactProfile, setShowContact }) => {  
  return (
    <div className='contact-profile'>
      {
        loading ? (
          <div className='u-center'>
            <Loader />
          </div>
        ) : (
          <Fragment>
            <div className='contact-profile__header'>
              <div 
                className='nav-button contact-profile__header--close'
                onClick={() => setShowContact(false)}>
                <img src={close__icon} alt='close contact info'/>
              </div>
            </div>
            <div className='contact-profile__image'>
              <UserImage user={user} size='big'/>
            </div>
            <div className='contact-profile__name u-margin-top-3 u-margin-bottom-3'>
              <div className='contact-profile__name--username'>{`${formatText(contactProfile.getProfile.firstname)} ${formatText(contactProfile.getProfile.lastname)}`}</div>
              <div className='contact-profile__name--userhandle'>{`@${contactProfile.getProfile.username}`}</div>
            </div>
            
            <div className='contact-profile__details'>
              <div className='contact-profile__details--label'>Email Address</div>
              <div className='contact-profile__details--content'>{contactProfile.getProfile.email}</div>
            </div>
            <div className='contact-profile__details'>
              <div className='contact-profile__details--label'>Location</div>
              <div className='contact-profile__details--content'>{formatText(contactProfile.getProfile.location)}</div>
            </div>
          </Fragment>
        )
      }
    </div>
  );
}

export default ContactProfile;