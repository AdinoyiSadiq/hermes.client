import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import ChatList from '../containers/ChatList';
import Messaging from '../containers/Messaging';
import ContactProfile from '../containers/ContactProfile';
import MessaginContext from '../context/Messaging';
import GET_CONTACT_PROFILE from '../queries/getContactProfile';

const Home = (props) => {
  const [getContactProfile, { loading: contactLoading, error: contactError, data: contactData }] = useLazyQuery(GET_CONTACT_PROFILE);
  const setActiveUser = (userId) => {
    getContactProfile({ variables: { userId } });
  }

  return (
    <div className='home'>
      <MessaginContext.Provider value={{ setActiveUser }}>
        <ChatList />
      </MessaginContext.Provider>
      <Messaging 
        contactProfile={contactData}
        loading={contactLoading}
        error={contactError}
      />
      <ContactProfile />
    </div>
  );
}

export default Home;