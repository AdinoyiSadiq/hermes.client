import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import SearchBox from '../../components/search/SearchBox';
import Loader from '../../components/loaders/Loader';
import UserList from './UserList';

import SEARCH_USERS from '../../queries/searchUsers';

const AddContactWrapper = ({ authUserId, setSearchState, search, history }) => {
  const [searchUsers, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_USERS);

  return (
    <div>
      <SearchBox 
        search={searchUsers} 
        setSearchState={setSearchState}
      />
      {
        searchLoading ? (
          <div className='u-center'>
            <Loader />
          </div>
        ) : (search && searchData && searchData.searchUsers.length === 0) ? (
          <div className='search__list--empty'>No users were found</div>
        ) : (search && searchData && searchData.searchUsers.length) ? (
          <UserList
            authUserId={authUserId}
            data={search ? searchData.searchUsers :  null}
            type={search && 'searchUser'}
          />
        ) : <div/>
      }
    </div>
  );
}

export default AddContactWrapper;
