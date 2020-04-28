import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { Query } from '@apollo/react-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import client from './apollo';
import './styles/styles.scss';

import Signup from './screens/Signup';
import Signin from './screens/Signin';
import Home from './screens/Home';
import HomeTest from './screens/HomeTest';
import RequireAuth from './components/auth/requireAuth';
import Authenticated from './components/auth/isAuthenticated';
import IS_AUTH_QUERY from './queries/isAuthenticated';

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Query query={IS_AUTH_QUERY}>
        {({ data: { isAuth } }) => (
            <Switch>
              <Route exact path='(/|/signup)' component={Authenticated(Signup, isAuth)}/>
              <Route exact path='/signin' component={Authenticated(Signin, isAuth)}/>
              <Route exact path='/home' component={RequireAuth(Home, isAuth)}/>
              <Route exact path='/homeTest' component={RequireAuth(HomeTest, isAuth)}/>
          </Switch>
        )}
      </Query>
    </Router>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));