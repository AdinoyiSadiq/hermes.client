import React, { Fragment, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import ChatList from '../containers/ChatList';
import Messaging from '../containers/Messaging';
import ContactProfile from '../containers/ContactProfile';
import MessaginContext from '../context/Messaging';
import GET_CONTACT_PROFILE from '../queries/getContactProfile';

const Home = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isActiveUser, setIsActiveUser] = useState({});
  const [getContactProfile, { loading: contactLoading, error: contactError, data: contactData }] = useLazyQuery(GET_CONTACT_PROFILE);
  const setActiveUser = (user) => {
    setIsActive(true);
    setIsActiveUser({ ...user });
    getContactProfile({ variables: { userId: user.id } });
  }

  return (
    <div className='home'>
      <MessaginContext.Provider value={{ setActiveUser }}>
        <ChatList />
      </MessaginContext.Provider>
      {
        isActive ? (
          <Fragment>
            <Messaging 
              user={isActiveUser}
            />
            {/* <ContactProfile 
              contactProfile={contactData}
              loading={contactLoading}
              error={contactError}
            /> */}
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