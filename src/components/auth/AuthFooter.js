import React, { Component } from 'react';

class AuthFooter extends Component {
  renderAuthFooter() {
    const { pathname } = this.props.children.props.location;
    if (pathname === `/signup`) {
      return (
        <div className='footer__text'>
          By clicking on "Create Account" you agree with our <span className='u-text-bold'>Terms of Service</span> and <span className='u-text-bold'>Privacy Policy</span>
        </div>
      );
    }
    return (
      <div className='footer__text'>
        We all forget things every now and then. <span className='u-text-bold'>Recover Password</span>
      </div>
    );
  }

  render() {
    return (
      <div className='footer'>
        {this.renderAuthFooter()}
      </div>
    );
  }
}

export default AuthFooter;
