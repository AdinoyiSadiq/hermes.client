import { gql } from 'apollo-boost';

export default gql`
  mutation CREATE_MESSAGE (
    $text: String!,
    $receiverId: Int,
    $quoteId: Int,
  ) {
    createMessage(
      text: $text, 
      receiverId: $receiverId,
      quoteId: $quoteId,
    ) {
      id
      text
      sender {
        id
      }
      receiver {
        id
      }
      quote {
        text
      }
      createdAt
    }
  }
`;