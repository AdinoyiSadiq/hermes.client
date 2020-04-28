import { gql } from 'apollo-boost';

export default gql`
  query GET_SENT_CONTACT_REQUESTS {
    getSentContactRequests {
      id
      status
      profileImage
      actionUserId
      user {
        id
        firstname
        lastname
        lastseen
      }
    }
  }
`;
