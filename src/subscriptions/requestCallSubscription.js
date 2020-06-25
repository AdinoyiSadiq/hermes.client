import { gql } from 'apollo-boost';

export default gql`
  subscription REQUEST_CALL_SUBSCRIPTION (
    $senderId: Int! 
    $receiverId: Int!
  ) {
    requestCall(
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
      iceCandidate
      type
    }
  }
`;