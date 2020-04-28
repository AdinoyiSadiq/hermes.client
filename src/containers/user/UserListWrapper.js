import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import SearchBox from '../../components/search/SearchBox';
import Loader from '../../components/loaders/Loader';
import UserList from './UserList';

import errorHandler from '../../lib/errorHandler';

import GET_ACTIVE_CHATS from '../../queries/getActiveChats';
import SEARCH_CONTACTS from '../../queries/searchContacts';
import SEARCH_USERS from '../../queries/searchUsers';
import MESSAGE_SUBSCRIPTION from '../../subscriptions/messageSubscription';
import DELETED_MESSAGE_SUBSCRIPTION from '../../subscriptions/deletedMessageSubscription';

const UserListWrapper = ({ 
  authUserId, 
  content, 
  chatButtonState, 
  contactsResults, 
  contactSentRequestResults, 
  contactReceivedRequestResults, 
  contactRejectedRequestResults, 
  setSearchState, 
  search, 
  history 
}) => {
  const { loading, error, data, subscribeToMore, refetch, client } = useQuery(GET_ACTIVE_CHATS);
  const [searchContacts, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_CONTACTS);
  const [searchUsers, { loading: searchUserLoading, error: searchUserError, data: searchUserData }] = useLazyQuery(SEARCH_USERS);

  const { loading: contactsLoading, error: contactsError, data: contactsData } = contactsResults;
  const { loading: contactSentRequestLoading, error: contactSentRequestError, data: contactSentRequestData } = contactSentRequestResults;
  const { loading: contactReceivedRequestLoading, error: contactReceivedRequestError, data: contactReceivedRequestData } = contactReceivedRequestResults;
  const { loading: contactRejectedRequestLoading, error: contactRejectedRequestError, data: contactRejectedRequestData } = contactRejectedRequestResults;

  if (error || contactsError || searchError || searchUserError || contactSentRequestError || contactReceivedRequestError || contactRejectedRequestError) {
    errorHandler((error || contactsError || searchError), client, history);
    return `Error! ${error || contactsError.message || searchError.message}`;
  }

  const filterUsers = (contacts, users) => {
    const contactIds = contacts.reduce((arr, o) => {
      arr.push(o.user.id)
      return arr
    }, [])
    const filteredUsers = users.filter((userObj) => {
      return !contactIds.includes(userObj.user.id)
    });
    return filteredUsers;
  }

  return (
    <div>
      <SearchBox 
        content={content}
        searchContacts={searchContacts}
        searchUsers={searchUsers}
        setSearchState={setSearchState} />
      {
        (loading || contactsLoading || searchLoading || searchUserLoading || contactSentRequestLoading || contactReceivedRequestLoading || contactRejectedRequestLoading) ? (
          <div className='u-center'>
            <Loader />
          </div>
        ) : (
          (search && searchData && searchData.searchContacts.length === 0) && 
          ((search && searchUserData && searchUserData.searchUsers.length === 0) || content === 'activeChats')
        ) ? (
          <div className='search__list--empty'>No users were found</div>
        ) : (
          <UserList
            authUserId={authUserId}
            data={search ? searchData && searchData.searchContacts : 
              (content === 'activeChats' && data) ? data.getActiveUsers : 
              content  === 'contactList' ? [...contactsData.getAllContacts, ...contactSentRequestData.getSentContactRequests, ...contactReceivedRequestData.getReceivedContactRequests, ...contactRejectedRequestData.getRejectedContactRequests] : null}
            users={search && content  === 'contactList' && searchUserData && searchUserData.searchUsers && filterUsers(searchData.searchContacts, searchUserData.searchUsers)}
            type={search ? 'search' : chatButtonState}
            view={chatButtonState}
            subscribeToNewMessages={({ senderId, receiverId}) => 
              subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
                variables: { senderId, receiverId },
                updateQuery: (prev, { subscriptionData }) => {
                  refetch();
                }
              })
            }
            subscribeToDeletedMessages={({ senderId, receiverId}) => 
              subscribeToMore({
                document: DELETED_MESSAGE_SUBSCRIPTION,
                variables: { senderId, receiverId },
                updateQuery: (prev, { subscriptionData }) => {
                  refetch();
                }
              })
            }
          />
        )
      }
    </div>
  )
}

export default UserListWrapper;
