export const errorHandler = async (error, client, history) => {
  if(error && error.message === 'GraphQL error: unauthorized request, please login') {
    localStorage.removeItem('authToken');
    await history.push('/signup');
    await client.clearStore();
  } else {
    console.log('Error: ', error.message);
  }
}

export default errorHandler;
