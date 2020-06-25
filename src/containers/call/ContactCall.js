import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import UserImage from '../../components/profile/UserImage';
import EndCallButton from '../../components/buttons/EndCallButton';
import CallButton from '../../components/buttons/CallButton';
import formatText from '../../lib/formatText';

import mic__off__icon from '../../images/mic-off-icon.png';
import video__off__icon from '../../images/vide-off-icon.png';

import mic__on__icon from '../../images/mic-on-icon.png';
import video__on__icon from '../../images/vide-on-icon.png';

import REQUEST_CALL from '../../mutations/requestCall';
import ACCEPT_CALL from '../../mutations/acceptCall';
import ACCEPT_CALL_SUBSCRIPTION from '../../subscriptions/acceptCallSubscription';

const ContactCall = ({ authUserId, isActiveCall, setActiveCall }) => {
  const { user, type, direction } = isActiveCall;
  const [videoStatus, setVideoStatus] = useState(false);
  const [micStatus, setMicStatus] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();

  const [requestCall] = useMutation(REQUEST_CALL);
  const [acceptCall] = useMutation(ACCEPT_CALL);

  useSubscription(
    ACCEPT_CALL_SUBSCRIPTION,
    { 
      variables: { senderId: user.id, receiverId: authUserId },
      onSubscriptionData: (res) => {
        if (res.subscriptionData.data && res.subscriptionData.data.acceptCall) {
          const { sender, offer } = res.subscriptionData.data.acceptCall;
          if (user.id === sender.id) {
            setRemoteDescription(offer);
          }
        }
      }
    }
  );

  useEffect(() => {
    const pc_config = null;
    const pc = new RTCPeerConnection(pc_config);
    pc.ontrack = (e) => remoteVideoRef.current.srcObject = e.streams[0];
    pcRef.current = pc;

    const constraints = (type === 'video') ? { video: true, audio: true } : { audio: true };
    const success = (stream) => {
      window.localStream = stream;
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    }
  
    const failure = (e) => {
      console.log('getUserMedia Error: ', e);
    }
  
    navigator.mediaDevices.getUserMedia(constraints)
              .then(success)
              .catch(failure);

    async function makeCall() {
      await handleCallType();
    }

    makeCall();
  }, []);

  const handleCallType = async () => {
    if (direction === 'out') {   
        try {
          const offer = await createOffer();
          const iceCandidateList = [];
          pcRef.current.onicecandidate = (event) => {
            if (event.candidate) {
              const iceCandidate = JSON.stringify(event.candidate);
              iceCandidateList.push(iceCandidate)
              if (iceCandidateList.length > 1) {
                requestCall({
                  variables: {
                    receiverId: user.id,
                    iceCandidate: iceCandidateList[0],
                    offer,
                    type
                  }
                });
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
    } else {
        try {
          const { iceCandidate, offer } = isActiveCall;

          await setRemoteDescription(offer);
          await addCandidate(iceCandidate);
          const answer = await createAnswer();
          acceptCall({
            variables: {
              receiverId: user.id,
              answer,
            }
          });
        } catch (e) {
          console.error(e);
        }
    }
  }

  const createOffer = async () => {
    const sdp = await pcRef.current.createOffer({offerToReceiveVideo: 1});
    await pcRef.current.setLocalDescription(sdp);
    return JSON.stringify(sdp);
  }

  const createAnswer = async () => {
    const sdp = await pcRef.current.createAnswer({offerToReceiveVideo: 1});
    await pcRef.current.setLocalDescription(sdp);
    return JSON.stringify(sdp);
  }

  const addCandidate = async (iceCandidate) => {
    const candidate = JSON.parse(iceCandidate);
    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  }

  const setRemoteDescription = async (offer) => {
    const desc = JSON.parse(offer);
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(desc))
  }

  const toggleVideoStatus = () => {
    setVideoStatus(!videoStatus);
  }

  const toggleMicStatus = () => {
    setMicStatus(!micStatus);
  }

  if (type === 'audio') {
    return (
      <div className='audio-call'>
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
            buttonStatus={videoStatus}
            disabled
          />
          <EndCallButton />
          <CallButton 
            image={(micStatus ? mic__on__icon : mic__off__icon)}
            buttonClick={toggleMicStatus}
            buttonStatus={micStatus}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className='video-call'>
      <video 
        className='video-call__main'
        ref={remoteVideoRef} 
        autoPlay
      />
      <video 
        className='video-call__sub'
        ref={localVideoRef} 
        autoPlay
      />
      <div className='contact-call-button__container'>
        <CallButton 
          image={(videoStatus ? video__on__icon : video__off__icon)}
          buttonClick={toggleVideoStatus}
          buttonStatus={videoStatus}
        />
        <EndCallButton />
        <CallButton 
          image={(micStatus ? mic__on__icon : mic__off__icon)}
          buttonClick={toggleMicStatus}
          buttonStatus={micStatus}
        />
      </div>
    </div>
  );
}

export default ContactCall;
