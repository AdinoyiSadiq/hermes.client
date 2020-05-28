export const errorHandler = async (error, client, history) => {
  if(error && error.message === 'GraphQL error: unauthorized request, please login') {
    localStorage.removeItem('authToken');
    await client.cache.reset();
    await client.writeData({ data: { isAuth: false } });
    window.location.reload();
  } else {
    console.log('Error: ', error.message);
  }
}

export default errorHandler;
