import { gql } from 'apollo-boost';

export default gql`
  query GET_MESSAGES(
    $receiverId: Int!
    $offset: Int
  ) {
    getMessages(
      receiverId: $receiverId 
      offset: $offset
    ) {
      id
      text
      createdAt
      quote {
        text
      }
      sender {
        id
        username
        lastname
      }
    }
  }
`;