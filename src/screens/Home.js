import React, { Fragment, useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import ChatList from '../containers/ChatList';
import Messaging from '../containers/Messaging';
import ContactProfile from '../containers/ContactProfile';
import RestrictedContact from '../containers/RestrictedContact';
import Loader from '../components/loaders/Loader';
import MessaginContext from '../context/Messaging';
import imageUploader from '../lib/imageUploader';
import newActiveUserResponseMessage from '../lib/newActiveUserResponse';
import errorHandler from '../lib/errorHandler';
import GET_AUTH_USER from '../queries/getAuthUser';
import GET_CONTACT_PROFILE from '../queries/getContactProfile';
import GET_MESSAGES from '../queries/getMessages';
import GET_ACTIVE_CHATS  from '../queries/getActiveChats';
import CREATE_MESSAGE from '../mutations/createMessage';

const Home = (props) => {
  const [messageLoading, setMessageLoading] = useState(false)
  const [isActive, setIsActive] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isActiveUser, setIsActiveUser] = useState({});
  const [uploadingImage, setUploadingImage] = useState({});
  const { loading: authUserLoading, error: authUserError, data: authUserData, client } = useQuery(GET_AUTH_USER);
  const [getContactProfile, { loading: contactLoading, error: contactError, data: contactData }] = useLazyQuery(GET_CONTACT_PROFILE);
  const [createMessage, { loading, error, data }] = useMutation(CREATE_MESSAGE);

  useEffect(() => {
    setMessageLoading(true);
    setTimeout(() => { setMessageLoading(false) }, 100);
  }, [isActiveUser.updated]);

  const setActiveUser = (user) => {
    setIsActive(true);
    setIsActiveUser({ ...user });
    getContactProfile({ variables: { userId: user.id } });
  }

  const sendImage = async ({ variables, imageFile }) => {
    setUploadingImage({ state: true, receiverId: variables.receiverId });
    try { 
      const uploadRes = await imageUploader(imageFile);
      if (uploadRes.data && uploadRes.data.secure_url) {
        variables.image = uploadRes.data.secure_url;
        variables.text = variables.text.trim();
        setUploadingImage({});
        createMessage({ 
          variables,
          update: (cache, { data: { createMessage } }) => {
            const activeUsers = cache.readQuery({ query: GET_ACTIVE_CHATS });
            const existingActiveUser = activeUsers && 
                                    activeUsers.getActiveUsers && 
                                    (activeUsers.getActiveUsers).find((activeUser) => activeUser.user.id === isActiveUser.id);
            const data = cache.readQuery({ 
              query: GET_MESSAGES,
              variables: { receiverId: isActiveUser.id },
            }); 
            cache.writeQuery({ 
              query: GET_MESSAGES, 
              variables: { receiverId: isActiveUser.id },
              data: { getMessages: [createMessage, ...data.getMessages] }
            });
            if (!existingActiveUser) {
              const newActiveUser = {...(newActiveUserResponseMessage(isActiveUser, createMessage))}
              cache.writeQuery({
                query: GET_ACTIVE_CHATS, 
                data: { getActiveUsers: [newActiveUser, ...activeUsers.getActiveUsers] }
              });
            } else {
              const updatedActiveUsersList = (activeUsers.getActiveUsers).map((activeUser) => {
                if (activeUser.user.id === isActiveUser.id) {
                  activeUser.lastMessage.text = createMessage.text;
                  activeUser.lastMessage.image = createMessage.image;
                  activeUser.lastMessage.createdAt = createMessage.createdAt;
                }
                return activeUser;
              });
              cache.writeQuery({
                query: GET_ACTIVE_CHATS, 
                data: { getActiveUsers: [...updatedActiveUsersList] }
              });
            }
          }
        });
      }
    } catch (error) {
      const { history } = props;
      errorHandler(error, client, history);
    }
  }

  if (error || authUserError || contactError) {
    const { history } = props;
    errorHandler(authUserError, client, history);
  }

  return (
    <div className='home'>
      {
        (authUserLoading || authUserError) ? (
          <div className='u-center'>
            <Loader />
          </div>
        ) : (
          <Fragment>
            <MessaginContext.Provider value={{ setActiveUser, isActiveUser }}>
              <ChatList 
                authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id}
                history={props.history}
              />
            </MessaginContext.Provider>
            { messageLoading ? (
                <div className='u-center'>
                  <Loader />
                </div>
            ) : isActive && isActiveUser && 
              (isActiveUser.status === 1 || (isActiveUser.contact && isActiveUser.contact.status === 1) || isActiveUser.updated) ? (
                <Fragment>
                  <Messaging 
                    user={isActiveUser}
                    authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id}
                    setShowContact={setShowContact}
                    sendImage={sendImage}
                    uploadingImage={uploadingImage}
                    history={props.history}
                  />
                  {
                    showContact && (
                      <ContactProfile 
                        user={isActiveUser}
                        contactProfile={contactData}
                        loading={contactLoading}
                        setShowContact={setShowContact}
                      />
                    )
                  }
                </Fragment>
              ) : isActive && 
              isActiveUser && 
              (isActiveUser.status !== 1 || (isActiveUser.contact && isActiveUser.contact.status !== 1)) ? (
                <RestrictedContact 
                  user={isActiveUser}
                  updateUser={setIsActiveUser}
                  authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id}
                />
              ) : <div />
            }
          </Fragment>
        )
      }
    </div>
  );
}

export default Home;