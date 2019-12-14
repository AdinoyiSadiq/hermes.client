import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Query } from '@apollo/react-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './styles/styles.scss';

import Signup from './screens/Signup';
import Signin from './screens/Signin';
import Home from './screens/HomeTest';
import RequireAuth from './components/auth/requireAuth';
import IS_AUTH_QUERY from './queries/isAuthenticated';

const client = new ApolloClient({
  uri: ' http://localhost:4000/graphql/',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('authToken') || '';
    operation.setContext({
      headers: {
        authorization: token
      }
    })
  },
  clientState: {
    defaults: {
      isAuth: !!localStorage.getItem('authToken')
    }
  },
  onError: (e) => { console.log(e) }
});

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Query query={IS_AUTH_QUERY}>
        {({ data: { isAuth } }) => (
            <Switch>
              <Route exact path='/signup' component={Signup}/>
              <Route exact path='/signin' component={Signin}/>
              <Route exact path='/home' component={RequireAuth(Home, isAuth)}/>
          </Switch>
        )}
      </Query>
    </Router>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));