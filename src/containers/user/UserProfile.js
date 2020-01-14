import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import ProfileForm from '../../components/profile/ProfileForm';
import Loader from '../../components/loaders/Loader';
import GET_USER_PROFILE from '../../queries/getUserProfile';

const UserProfile = (props) => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  if (loading) {
    return (
      <div className='u-center'>
        <Loader />
      </div>
    )
  };
  if (error) return `Error! ${error}`;

  const profile = data && data.getProfile;
  return <ProfileForm profile={profile} />
}

export default UserProfile;
