import { gql } from 'apollo-boost';

export default gql`
  mutation USER_TYPING (
    $senderId: Int!
    $receiverId: Int!
  ) {
    userTyping(
      senderId: $senderId,
      receiverId: $receiverId,
    ) 
  }
`;