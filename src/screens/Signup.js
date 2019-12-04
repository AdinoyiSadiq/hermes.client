import React, { Component } from 'react';
import Auth from '../templates/Auth';
import SignupForm from '../components/auth/SignupForm';

class Signup extends Component {
  render() {
    return (
      <div>
        <Auth>
          <SignupForm {...this.props}/>
        </Auth>
      </div>
    );
  }
}

export default Signup;
