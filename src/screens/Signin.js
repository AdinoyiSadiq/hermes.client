import React, { Component } from 'react';
import Auth from '../templates/Auth';
import SigninForm from '../components/auth/SigninForm';

class Signin extends Component {
  render() {
    return (
      <div>
        <Auth>
          <SigninForm {...this.props}/>
        </Auth>
      </div>
    );
  }
}

export default Signin;
