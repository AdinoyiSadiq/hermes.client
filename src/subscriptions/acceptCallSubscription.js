import { gql } from 'apollo-boost';

export default gql`
  subscription ACCEPT_CALL_SUBSCRIPTION (
    $senderId: Int! 
    $receiverId: Int!
  ) {
    acceptCall(
      senderId: $senderId,
      receiverId: $receiverId
    ) {
      sender {
        id
        username
        firstname
        lastname
        profileImage
      }
      offer
    }
  }
`;