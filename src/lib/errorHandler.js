export const errorHandler = async (error, client, history) => {
  if(error && error.message === 'GraphQL error: unauthorized request, please login') {
    localStorage.removeItem('authToken');
    await client.clearStore();
    window.location.reload();
  } else {
    console.log('Error: ', error.message);
  }
}

export default errorHandler;
