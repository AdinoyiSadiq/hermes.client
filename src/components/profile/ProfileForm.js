import React, { useState, useEffect } from 'react';
import { Mutation } from '@apollo/react-components';
import Loader from '../../components/loaders/Loader';
import ProfileInput from '../../components/forms/ProfileInput';
import UPDATE_PROFILE from '../../mutations/updateProfile';
import validateAuth from '../../lib/validation';
import imageUploader from '../../lib/imageUploader';
import formatText from '../../lib/formatText';
import update__image__icon from '../../images/update-image.svg';

const ProfileForm = (props) => {
  const { profile } = props;
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [inputValue, setInputValue] = useState({
    firstname: updatedDetails.firstname || profile.firstname || '',
    lastname: updatedDetails.lastname || profile.lastname || '',
    username: updatedDetails.username || profile.username || '',
    email: updatedDetails.email || profile.email || '',
    profileImage: updatedDetails.profileImage || profile.profileImage || '',
    location: updatedDetails.location || profile.location || '',
  });
  const [touchedInput, setTouchedInput] = useState({});
  const [validationError, setValidationError] = useState({});
  const [apiError, setApiError] = useState({});
  const [uploadLoading, setUploadLoading] = useState(false)

  const fieldNames = ['firstname', 'lastname', 'username', 'email', 'location'];

  const resetUserDetails = (event) => {
    if(event.keyCode === 27) {
      setInputValue({
        firstname: updatedDetails.firstname || profile.firstname,
        lastname: updatedDetails.lastname || profile.lastname,
        username: updatedDetails.username || profile.username,
        email: updatedDetails.email || profile.email,
        location: updatedDetails.location || profile.location,
      });
      setTouchedInput({});
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", resetUserDetails, false);
    
    return () => {
      document.removeEventListener("keydown", resetUserDetails, false);
    };
  });

  const updateUserDetail = async (type, updateProfile) => { 
    setValidationError({ ...validationError, [type]: false });
    if (!inputValue[type]) {
      setInputValue({ ...inputValue, [type]: profile[type] });
      setTouchedInput({ ...touchedInput, [type]: false });
    } else {
      const error = validateAuth({ [type]: inputValue[type] }, fieldNames);
      if (error[type]) {
        setValidationError({ ...validationError, [type]: error[type] });
      } else {
        const res = await updateProfile({ variables: { [type]: inputValue[type] } });
        if (res && res.data && res.data.updateProfile) {
          setUpdatedDetails({ ...updatedDetails, [type]: res.data.updateProfile[type] })
        }
        setTouchedInput({ ...touchedInput, [type]: false });
      }
    }
  }

  const uploadImage = async (event, updateProfile) => {
    try {
      setApiError({});
      setUploadLoading(true);
      const file = event.target.files && event.target.files[0];
      // Note: test for empty file 
      const uploadRes = await imageUploader(file);
      if (uploadRes.data && uploadRes.data.secure_url) {
        const res = await updateProfile({ variables: { profileImage: uploadRes.data.secure_url } });
        if (res && res.data && res.data.updateProfile) {
          setInputValue({ ...inputValue, profileImage: res.data.updateProfile.profileImage });
        }
      }
      setUploadLoading(false);
    } catch (error) {
      setApiError({ message: 'An error occurred during upload'})
      setUploadLoading(false);
    }
  } 

  return (
    <div className='user-profile'>
      <Mutation mutation={UPDATE_PROFILE}>
        {(updateProfile, { error }) => (
          <div className='profile__image--container u-margin-top-3'>
            <div className='profile__image--shape'>
              {
                uploadLoading ? <Loader size='medium' /> : 
                (
                  <div>
                    {
                      inputValue.profileImage ? 
                      <img className='profile__image' src={inputValue.profileImage} alt='profile'/> : 
                      <div className='profile__image--placeholder'>
                        {`${profile.firstname && profile.firstname.charAt(0).toUpperCase()}${profile.lastname && profile.lastname.charAt(0).toUpperCase()}`}
                      </div>
                    }
                    <input 
                      type='file'
                      id='file'
                      name='file'
                      placeholder='Upload an image'
                      className='profile__image--picker'
                      accept='image/x-png,image/jpeg'
                      onChange={event => uploadImage(event, updateProfile)}
                    />
                    <img className='update__image' src={update__image__icon} alt='update'/>
                  </div>
                )
              }
            </div>
            {
              error ? 
              <div className='u-error'>{error.message}</div> : 
              apiError ? 
              <div className='u-error'>{apiError.message}</div> : ''
            }
          </div>
        )}
      </Mutation>
      <div className='profile__input--container u-margin-top-4'>
        <Mutation mutation={UPDATE_PROFILE}>
          {(updateProfile, { loading, error }) => (
            <ProfileInput 
              name='firstname'
              placeholder='First name'
              value={formatText(inputValue.firstname)}
              touched={touchedInput.firstname}
              loading={loading}
              error={error}
              validationError={validationError}
              handleChange={event => setInputValue({ ...inputValue, firstname: event.target.value})}
              handleFocus={() => setTouchedInput({ ...touchedInput, firstname: true })}
              updateUserDetail={() => updateUserDetail('firstname', updateProfile)}
            />
          )}
        </Mutation>
      </div>
      <div className='profile__input--container u-margin-top-2'>
        <Mutation mutation={UPDATE_PROFILE}>
          {(updateProfile, { loading, error }) => (
            <ProfileInput
              name='lastname' 
              placeholder='Last name'
              value={formatText(inputValue.lastname)}
              touched={touchedInput.lastname}
              loading={loading}
              error={error}
              validationError={validationError}
              handleChange={event => setInputValue({ ...inputValue, lastname: event.target.value})}
              handleFocus={() => setTouchedInput({ ...touchedInput, lastname: true })}
              updateUserDetail={() => updateUserDetail('lastname', updateProfile)}
            />
          )}
        </Mutation>
      </div>
      <div className='profile__input--container u-margin-top-2'>
        <Mutation mutation={UPDATE_PROFILE}>
          {(updateProfile, { loading, error }) => (
            <ProfileInput 
              name='username'
              placeholder='User name'
              value={inputValue.username}
              touched={touchedInput.username}
              loading={loading}
              error={error}
              validationError={validationError}
              handleChange={event => setInputValue({ ...inputValue, username: event.target.value})}
              handleFocus={() => setTouchedInput({ ...touchedInput, username: true })}
              updateUserDetail={() => updateUserDetail('username', updateProfile)}
            />
          )}
        </Mutation>
      </div>
      <div className='profile__input--container u-margin-top-2'>
      <Mutation mutation={UPDATE_PROFILE}>
          {(updateProfile, { loading, error }) => (
            <ProfileInput
              name='email' 
              placeholder='Email'
              value={inputValue.email}
              touched={touchedInput.email}
              loading={loading}
              error={error}
              validationError={validationError}
              handleChange={event => setInputValue({...inputValue, email: event.target.value})}
              handleFocus={() => setTouchedInput({ ...touchedInput, email: true })}
              updateUserDetail={() => updateUserDetail('email', updateProfile)}
            />
          )}
      </Mutation>
      </div>
      <div className='profile__input--container u-margin-top-2'>
      <Mutation mutation={UPDATE_PROFILE}>
          {(updateProfile, { loading, error }) => (
            <ProfileInput 
              name='location'
              placeholder='Location'
              value={inputValue.location}
              touched={touchedInput.location}
              loading={loading}
              error={error}
              validationError={validationError}
              handleChange={event => setInputValue({...inputValue, location: event.target.value})}
              handleFocus={() => setTouchedInput({ ...touchedInput, location: true })}
              updateUserDetail={() => updateUserDetail('location', updateProfile)}
            />
          )}
      </Mutation>
      </div>
    </div>
  );
}

export default ProfileForm;
