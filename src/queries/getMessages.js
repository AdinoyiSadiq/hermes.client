import { gql } from 'apollo-boost';

export default gql`
  query GET_MESSAGES(
    $receiverId: Int!
    $offset: Int
    $limit: Int
  ) {
    getMessages(
      receiverId: $receiverId 
      offset: $offset
      limit: $limit
    ) {
      id
      text
      image
      createdAt
      quote {
        id
        text
        image
        sender {
          id
          firstname
          lastname
        }
      }
      sender {
        id
        firstname
        lastname
      }
      receiver {
        id
      }
    }
  }
`;