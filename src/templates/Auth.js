import React, { Component } from 'react';
import AuthHeader from '../components/auth/AuthHeader';
import AuthFooter from '../components/auth/AuthFooter';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

class Auth extends Component {
  render() {
    return (
      <div className='auth'>
        <AuthHeader {...this.props} />
        <div className='container animated-fadeIn'>
          <h1 className='heading-primary u-margin-top-3'>
            Join the Hermes way
          </h1>
          {this.props.children}
          <div className='login-text u-margin-bottom-1 u-hide'>or continue with</div>
          <SocialLoginButtons {...this.props} />
        </div>
        <AuthFooter {...this.props}/>
      </div>
    );
  }
}

export default Auth;