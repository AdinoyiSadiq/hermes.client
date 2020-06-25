import { gql } from 'apollo-boost';

export default gql`
  mutation REQUEST_CALL (
    $receiverId: Int!,
    $iceCandidate: String!,
    $offer: String!
    $type: String!
  ) {
    requestCall(
      receiverId: $receiverId,
      iceCandidate: $iceCandidate,
      offer: $offer,
      type: $type
    ) 
  }
`;