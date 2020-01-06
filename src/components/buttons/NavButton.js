import React from 'react';

const NavButton = ({ content, image, setContentState }) => {
  return (
    <div 
      className='nav-button'
      onClick={() => setContentState(content)}>
      <img src={image} alt='profile'/>
    </div>
  );
}

export default NavButton;
