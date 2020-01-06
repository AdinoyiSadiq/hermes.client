import React, {Component} from 'react';

export default function (ComposedComponent, isAuthenticated) {
  // Note: Ensure that when a user's token expires the app kicks them out
  class RequireAuth extends Component {
    componentWillMount() {
      if (!isAuthenticated) {
          this.props.history.push('/signup');
      }
    }

    componentWillUpdate(nextProps) {
      if (!isAuthenticated) {
          this.props.history.push('/signup');
      }
    }

    render() {
        return <ComposedComponent {...this.props} />
    }
  }

  return RequireAuth;
}