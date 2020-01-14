import React from 'react';

const NavButton = ({ content, image, setContentState, active, toggle }) => {
  return (
    <div 
      className={`nav-button ${active && 'nav-button--active'} ${toggle && 'nav-button--inactive'}`}
      onClick={() => setContentState(content)}>
      <img src={image} alt='profile'/>
    </div>
  );
}

export default NavButton;
