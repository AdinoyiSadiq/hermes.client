import React, { Fragment, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import ChatList from '../containers/ChatList';
import Messaging from '../containers/Messaging';
import ContactProfile from '../containers/ContactProfile';
import Loader from '../components/loaders/Loader';
import MessaginContext from '../context/Messaging';
import imageUploader from '../lib/imageUploader';
import GET_AUTH_USER from '../queries/getAuthUser';
import GET_CONTACT_PROFILE from '../queries/getContactProfile';
import GET_MESSAGES from '../queries/getMessages';
import GET_ACTIVE_CHATS  from '../queries/getActiveChats';
import CREATE_MESSAGE from '../mutations/createMessage';

const Home = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isActiveUser, setIsActiveUser] = useState({});
  const [uploadingImage, setUploadingImage] = useState({});
  const { loading: authUserLoading, error: authUserError, data: authUserData } = useQuery(GET_AUTH_USER);
  const [getContactProfile, { loading: contactLoading, error: contactError, data: contactData }] = useLazyQuery(GET_CONTACT_PROFILE);
  const [createMessage, { loading, error, data }] = useMutation(CREATE_MESSAGE);

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
        setUploadingImage({});
        createMessage({ 
          variables,
          update: (cache, { data: { createMessage } }) => {
            const activeUsers = cache.readQuery({ query: GET_ACTIVE_CHATS });
            const updatedActiveUsersList = (activeUsers.getActiveUsers).map((activeUser) => {
              if (activeUser.user.id === isActiveUser.id) {
                activeUser.lastMessage.text = createMessage.text;
                activeUser.lastMessage.image = createMessage.image;
                activeUser.lastMessage.createdAt = createMessage.createdAt;
              }
              return activeUser;
            });
            const data = cache.readQuery({ 
              query: GET_MESSAGES,
              variables: { receiverId: isActiveUser.id },
            });
            cache.writeQuery({ 
              query: GET_MESSAGES, 
              variables: { receiverId: isActiveUser.id },
              data: { getMessages: [createMessage, ...data.getMessages] }
            });
            cache.writeQuery({
              query: GET_ACTIVE_CHATS, 
              data: { getActiveUsers: [...updatedActiveUsersList] }
            });
          }
        });
      }
    } catch (error) {
      console.log('This is an error');
    }
  }

  return (
    <div className='home'>
      <MessaginContext.Provider value={{ setActiveUser }}>
        <ChatList 
          authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id}
        />
      </MessaginContext.Provider>
      { authUserLoading ? (
        <div className='u-center'>
          <Loader />
        </div>
      ) : isActive ? (
          <Fragment>
            <Messaging 
              user={isActiveUser}
              authUserId={authUserData && authUserData.getAuthUser && authUserData.getAuthUser.id}
              setShowContact={setShowContact}
              sendImage={sendImage}
              uploadingImage={uploadingImage}
            />
            {
              showContact && (
                <ContactProfile 
                  user={isActiveUser}
                  contactProfile={contactData}
                  loading={contactLoading}
                  error={contactError}
                  setShowContact={setShowContact}
                />
              )
            }
          </Fragment>
        ) : (
          <div>
            Sync Your Phone
          </div>
        )
      }

    </div>
  );
}

export default Home;