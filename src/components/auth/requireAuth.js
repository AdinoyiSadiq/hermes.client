import React, {Component} from 'react';

export default function (ComposedComponent, isAuthenticated, isActiveCall, setActiveCall) {
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
        return (
          <ComposedComponent 
            {...this.props} 
            isActiveCall={isActiveCall} 
            setActiveCall={setActiveCall}
          />
        );
    }
  }

  return RequireAuth;
}