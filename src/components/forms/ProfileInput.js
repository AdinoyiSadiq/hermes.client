import React from 'react';
import Loader from '../../components/loaders/Loader';
import profile__tick__icon from '../../images/profile-tick.svg';
import profile__edit__icon from '../../images/profile-edit.svg';

const ProfileInput = (props) => {
  const {
    name, type, placeholder, value, touched, handleChange, handleFocus, updateUserDetail, loading, error, validationError
  } = props;
  return (
    <div className={`profile__input ${touched && 'profile__input--active'} ${(error || validationError[name]) && 'profile__input--error'}`}>
      <div>{placeholder}</div>
      <div>
        <input
          id={name} 
          value={value}
          type={type || 'text'}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        { loading ? (
          <div className='loader__center u-margin-left-1'>
            <Loader size='small' />
          </div>
        ) : 
          !touched ? (
            <label className='profile__button--container' htmlFor={name}>
              <img className='profile__button--edit' src={profile__edit__icon} alt='edit'/>
            </label>
          ) : (
          <button 
            className='profile__button--container'
            onClick={updateUserDetail}>
            <img className='profile__button--tick' src={profile__tick__icon} alt='tick'/>
          </button>
        )}
      </div>
      { 
        error ? 
        <div className='u-error'>{error.message}</div> :
        validationError[name] ? 
        <div className='u-error'>{validationError[name]}</div> : ''
      }
    </div>
  );
}

export default ProfileInput;
