import React, { Component } from 'react';

class AuthFooter extends Component {
  render() {
    const { pathname } = this.props.children.props.location;
    return (
      <div className={`login-group ${pathname === `/signin` && 'u-margin-bottom-16'} u-hide`}>
        <div className='login-item login-item--facebook btn-animated'></div>
        <div className='login-item login-item--google btn-animated'></div>
        <div className='login-item login-item--twitter btn-animated'></div>
      </div>
    );
  }
}

export default AuthFooter;