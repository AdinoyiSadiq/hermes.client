import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import ProfileForm from '../../components/profile/ProfileForm';
import Loader from '../../components/loaders/Loader';
import errorHandler from '../../lib/errorHandler';
import GET_USER_PROFILE from '../../queries/getUserProfile';

const UserProfile = ({ history }) => {
  const { loading, error, data, client } = useQuery(GET_USER_PROFILE);

  if (loading) {
    return (
      <div className='u-center'>
        <Loader />
      </div>
    )
  };

  if (error) {
    errorHandler(error, client, history);
    return `Error! ${error}`;
  }

  const profile = data && data.getProfile;
  return <ProfileForm profile={profile} />
}

export default UserProfile;
