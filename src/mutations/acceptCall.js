import { gql } from 'apollo-boost';

export default gql`
  mutation ACCEPT_CALL (
    $receiverId: Int!,
    $answer: String!
  ) {
    acceptCall(
      receiverId: $receiverId,
      answer: $answer,
    ) 
  }
`;