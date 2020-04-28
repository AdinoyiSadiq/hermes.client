import React, {Component} from 'react';

export default function (ComposedComponent, isAuthenticated) {
  class Authenticated extends Component {
    componentWillMount() {
      if (isAuthenticated) {
          this.props.history.push('/home');
      }
    }

    render() {
        return <ComposedComponent {...this.props} />
    }
  }

  return Authenticated;
}