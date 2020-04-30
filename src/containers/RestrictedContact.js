import React, { useState, useEffect, Fragment } from 'react';
import { useMutation } from '@apollo/react-hooks';
import UserImage from '../components/profile/UserImage';
import Button from '../components/buttons/Button';
import formatText from '../lib/formatText';
import newContactResponse from '../lib/newContactResponse';

import REQUEST_CONTACT from '../mutations/requestContact';
import CANCEL_CONTACT_REQUEST from '../mutations/cancelContactRequest';
import ACCEPT_CONTACT_REQUEST from '../mutations/acceptContact';
import REJECT_CONTACT_REQUEST from '../mutations/rejectContact';
import GET_SENT_CONTACT_REQUESTS from '../queries/getSentContactRequests';
import GET_RECEIVED_CONTACT_REQUESTS from '../queries/getReceivedContactRequests';

const RestrictedContact = ({ user, authUserId, updateUser }) => {
  const [requestState, setRequestState] = useState(false);
  const [cancelRequestState, setCancelRequestState] = useState(false);
  const [rejectRequestState, setRejectRequestState] = useState(false);
  const [requestContact, { loading: requestContactLoading }] = useMutation(REQUEST_CONTACT);
  const [cancelContactRequest, { loading: cancelContactRequestLoading }] = useMutation(CANCEL_CONTACT_REQUEST);
  const [acceptContact, { loading: acceptContactLoading }] = useMutation(ACCEPT_CONTACT_REQUEST);
  const [rejectContact, { loading: rejectContactLoading }] = useMutation(REJECT_CONTACT_REQUEST);

  useEffect(() => {
    setRequestState(false);
    setCancelRequestState(false);
  }, [user.id]);
  
  const requestUserContact = async () => {
    const response = await requestContact({ 
      variables: { receiverId: user.id },
      update: (cache) => {
        const userContactRequests = cache.readQuery({ query: GET_SENT_CONTACT_REQUESTS });
        const newUserContact = {...(newContactResponse(user, authUserId))}
        cache.writeQuery({
          query: GET_SENT_CONTACT_REQUESTS, 
          data: { getSentContactRequests: [newUserContact, ...userContactRequests.getSentContactRequests] }
        });
      }
    });
    if (response && response.data && response.data.requestContact) {
      setRequestState(true);
    }
  }

  const cancelUserContactRequest = async () => {
    const response = await cancelContactRequest({
      variables: { receiverId: user.id },
      update: (cache) => {
        const userContactRequests = cache.readQuery({ query: GET_SENT_CONTACT_REQUESTS });
        cache.writeQuery({
          query: GET_SENT_CONTACT_REQUESTS, 
          data: { getSentContactRequests: userContactRequests.getSentContactRequests.filter(contact => contact.user.id !== user.id) }
        });
      }
    });

    if (response && response.data && response.data.cancelContactRequest) {
      setCancelRequestState(true);
    }
  }

  const acceptUserContactRequest = async () => {
    await acceptContact({
      variables: { requesterId: user.id },
      update: (cache) => {
        updateUser({ ...user, updated: true });
      }
    });
  }

  const rejectUserContactRequest = async () => {
    const response = await rejectContact({
      variables: { requesterId: user.id },
      update: (cache) => {
        const userContactRequests = cache.readQuery({ query: GET_RECEIVED_CONTACT_REQUESTS });
        cache.writeQuery({
          query: GET_RECEIVED_CONTACT_REQUESTS, 
          data: { getReceivedContactRequests: userContactRequests.getReceivedContactRequests.filter(contact => contact.user.id !== user.id) }
        });
      }
    });

    if (response && response.data && response.data.rejectContact) {
      setRejectRequestState(true);
    }
  }

  const showActionButton = () => {
    const status = user.contact ? user.contact.status : user.status;
    const actionUserId = user.contact ? user.contact.actionUserId : user.actionUserId;
    if (!status && !actionUserId) {
      return (
        <div> 
          {
            requestState ? (
              <div className='restricted-contact-profile__message--success'>
                Request Sent! 
              </div>
            ) : (
              <div className='restricted-contact-profile__button'>
                <Button 
                  type='submit' 
                  buttonClick={requestUserContact}>
                  {requestContactLoading ? 'Loading...' : 'Add Contact'}
                </Button>
              </div>
            )
          }
        </div>
      );
    } else if ((!status && actionUserId === authUserId) || (status && actionUserId !== authUserId)) {
      return (
        <div>
          {
            cancelRequestState ? (
              <div className='restricted-contact-profile__message--success'>
                Request Cancelled! 
              </div>
            ) : (
              <Fragment>
                <div className='restricted-contact-profile__message'>
                  {`Waiting for ${formatText(user.firstname)} to respond to your request`}
                </div>
                <div className='restricted-contact-profile__button'>
                  <Button 
                    type='submit'
                    buttonClick={cancelUserContactRequest}>
                    {cancelContactRequestLoading ? 'Loading...' : 'Cancel Request'}
                  </Button>
                </div>
              </Fragment>
            )
          }
        </div>
      );
    } else if (!status && actionUserId !== authUserId) {
      return (
        <div>
          {
            rejectRequestState ? (
              <div className='restricted-contact-profile__message--success'>
                Request Declined! 
              </div>
            ) : (
              <Fragment>
                <div className='restricted-contact-profile__message'>
                  {`${formatText(user.firstname)} would like to add you as a contact`}
                </div>
                <Button 
                  type='submit'
                  disabled={acceptContactLoading || rejectContactLoading}
                  buttonClick={acceptUserContactRequest}>
                  Accept
                </Button>
                <Button 
                  type='submit'
                  disabled={acceptContactLoading || rejectContactLoading}
                  buttonClick={rejectUserContactRequest}>
                  Decline
                </Button>
              </Fragment>
            )
          }
        </div>
      );
    } else if (status === 2 && actionUserId === authUserId) {
      return (
        <div className='restricted-contact-profile__message--success'>
          Request Declined! 
        </div>
      );
    }
  }

  return (
    <div className='restricted-contact-profile'>
      <div className='contact-profile__image'>
        <UserImage user={user} size='large'/>
      </div>
      <div className='restricted-contact-profile__name'>
        {`${formatText(user.firstname)} ${formatText(user.lastname)}`}
      </div>
      <div className='restricted-contact-profile__button--container'>
        {showActionButton()}
      </div>
    </div>
  );
}

export default RestrictedContact;
