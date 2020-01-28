import { gql } from 'apollo-boost';

export default gql`
  subscription MESSAGE_SUBSCRIPTION (
    $senderId: Int! 
    $receiverId: Int!
  ) {
    message(
      senderId: $senderId,
      receiverId: $receiverId
    ) {
      id
      text
      createdAt
      quote {
        text
      }
      sender {
        id
      }
    }
  }
`;
