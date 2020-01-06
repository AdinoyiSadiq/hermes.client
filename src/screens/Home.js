import React from 'react';
import ChatList from '../containers/ChatList';
import Messaging from '../containers/Messaging';
import ContactProfile from '../containers/ContactProfile';

const Home = (props) => {
  return (
    <div className='home'>
      <ChatList />
      <Messaging />
      <ContactProfile />
    </div>
  );
}

export default Home;