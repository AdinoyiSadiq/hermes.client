import React from 'react';

const UserImage = ({ user, size }) => {
  return user.profileImage ? (
    <div className={`user__avatar ${ size && `user__avatar--${size}`}`}>
      <img  src={user.profileImage} alt='user avatar' />
    </div>
  ) : (
    <div className={`user__avatar--placeholder ${ size && `user__avatar--placeholder-${size}`}`}>
      {`${user.firstname && user.firstname.charAt(0).toUpperCase()}${user.lastname && user.lastname.charAt(0).toUpperCase()}`}
    </div>
  ); 
}

export default UserImage;
