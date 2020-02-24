import { gql } from 'apollo-boost';

export default gql`
  query GET_MESSAGES(
    $receiverId: Int!
    $cursor: String
    $limit: Int
    $position: String
  ) {
    getMessages(
      receiverId: $receiverId 
      cursor: $cursor
      limit: $limit
      position: $position
    ) {
      id
      text
      image
      state
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
        createdAt
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