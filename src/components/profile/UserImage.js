import React from 'react';

const UserImage = ({ user, size }) => {
  return user.profileImage ? (
    <div className={`user__avatar ${ size === 'small' && `user__avatar--small`}`}>
      <img  src={user.profileImage} alt='user avatar' />
    </div>
  ) : (
    <div className='user__avatar--placeholder'>
      {`${user.firstname && user.firstname.charAt(0)}${user.lastname && user.lastname.charAt(0)}`}
    </div>
  ); 
}

export default UserImage;
