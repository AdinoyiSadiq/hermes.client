import React, {Component} from 'react';

export default function (ComposedComponent, isAuthenticated) {
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